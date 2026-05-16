import { generateText } from 'ai'
import { requireAuth } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export const maxDuration = 30

function hasOpenAiKeyConfigured() {
  return Boolean(process.env.OPENAI_API_KEY)
}

function formatFieldLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (s) => s.toUpperCase())
}

function formatDynamicInputs(userInputs: Record<string, unknown>) {
  const entries = Object.entries(userInputs)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
    .map(([key, value]) => ({
      key,
      label: formatFieldLabel(key),
      value: String(value).trim(),
    }))

  const inputBlock = entries.map(({ label, value }) => `- ${label}: ${value}`).join('\n')
  const keyBlock = entries.map(({ key, label }) => `- ${key} => ${label}`).join('\n')

  return { entries, inputBlock, keyBlock }
}


function createFallbackDocument(systemPrompt: string, entries: Array<{ label: string; value: string }>) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const details = entries.map(({ label, value }) => `${label}: ${value}`).join('\n')

  return `LEGAL DOCUMENT DRAFT
Generated on: ${today}

Document Context:
${systemPrompt.trim() || '[not provided]'}

Provided Information:
${details}

Statement:
This document draft was generated from the information supplied by the user. It is intended as a professional template and should be reviewed before submission.

Requested Relief / Outcome:
[not provided]

Additional Notes:
- The AI service is currently unavailable, so this draft was created using your submitted answers.
- Verify names, dates, addresses, and all factual assertions before use.
- If needed, seek legal advice for jurisdiction-specific requirements.
`
}


export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const { templateId, systemPrompt, userInputs } = await req.json()

     if (!templateId || !systemPrompt || !userInputs || typeof userInputs !== 'object') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check user credits
    const userCredits = await sql`
      SELECT * FROM user_credits
      WHERE user_id = ${user.id}
    `

    const credits = userCredits[0] || { credits_available: 0 }

    if (credits.credits_available < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase credits or subscribe to a plan.' },
        { status: 402 }
      )
    }

    // Format user inputs for the AI prompt
    const { entries, inputBlock, keyBlock } = formatDynamicInputs(userInputs)

    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No usable input fields were provided' },
        { status: 400 }
      )
    }

    let text = ''
    let generatedWithFallback = false

    // Generate the document using AI
    const aiPrompt = `${systemPrompt}

      You are generating a document from dynamic backend form fields. Field names are not fixed and may change by template.

      Dynamic field mapping (raw key => human label):
      ${keyBlock}

      Provided template data:
      ${inputBlock}

      Instructions:
      1) Use only provided facts. Do not invent names, addresses, dates, legal references, diagnoses, or outcomes.
      2) If any expected legal or procedural fact is missing, continue professionally using neutral placeholders like "[not provided]" and avoid hallucinations.
      3) Convert dynamic keys into natural language in the final document (never show raw JSON keys).
      4) Follow the document type and jurisdiction requested in the system prompt. Do not force UK format unless explicitly requested.
      5) Produce a complete, ready-to-use professional document with suitable structure for the requested type (for example: letter, statement, notice, agreement, submission, or application).
      6) If the requested output is a letter, include sender/recipient/date/subject/salutation/body/closing where available.
      7) Where relevant, include concise legal/procedural framing aligned to the user's system prompt, but do not cite fictional laws or case law.

      Return only the final document content with proper line breaks.`

    const shouldUseFallback = !hasOpenAiKeyConfigured()

    if (shouldUseFallback) {
      generatedWithFallback = true
      text = createFallbackDocument(systemPrompt, entries)
    } else {
      try {
        const aiResult = await generateText({
          model: 'openai/gpt-4o',
          prompt: aiPrompt,
          maxOutputTokens: 2000,
          temperature: 0.7,
        })
        text = aiResult.text
      } catch (aiError: any) {
        const message = String(aiError?.message || '').toLowerCase()
        if (message.includes('api key') || message.includes('authentication') || message.includes('unauthorized')) {
          console.warn('[v0] Falling back to rule-based document generation due to AI auth/config issue.')
          generatedWithFallback = true
          text = createFallbackDocument(systemPrompt, entries)
        } else {
          throw aiError
        }
      }
    }      

    // Get template name for the document title
    const template = await sql`
      SELECT name FROM templates WHERE id = ${templateId}
    `

     const templateName = template[0]?.name || `Template ${templateId}`

    // Save the generated document
    const result = await sql`
      INSERT INTO documents (user_id, template_id, title, content, user_inputs, status, credits_used)
      VALUES (
        ${user.id},
        ${templateId},
        ${templateName},
        ${text},
        ${JSON.stringify(userInputs)},
        'draft',
        1
      )
      RETURNING id
    `

    const documentId = result[0].id

    // Deduct credit
    if (userCredits.length === 0) {
      await sql`
        INSERT INTO user_credits (user_id, credits_available, credits_used)
        VALUES (${user.id}, -1, 1)
      `
    } else {
      await sql`
        UPDATE user_credits
        SET credits_available = credits_available - 1,
            credits_used = credits_used + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user.id}
      `
    }

    return NextResponse.json({
      success: true,
      documentId,
      usedFallback: generatedWithFallback,
    })
  } catch (error: any) {
    console.error('[v0] Document generation error:', error)
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const message = error?.message || 'Unknown error'

    if (message.toLowerCase().includes('api key')) {
      return NextResponse.json(
        {
          error: 'AI API key is missing or invalid. Set OPENAI_API_KEY in environment variables.',
          debugCode: 'AI_KEY_INVALID_OR_MISSING',
          details: message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate document. Please try again.', debugCode: 'DOCUMENT_GENERATION_FAILED', details: message },
      { status: 500 }
    )
  }
}
