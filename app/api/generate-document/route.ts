import { generateText } from 'ai'
import { requireAuth } from '@/lib/auth'
import {
  createDocument,
  deductUserCredits,
  getCreditsPerDocumentForUser,
  getTemplateName,
  getUserCredits,
} from '@/lib/document-generation-repo'
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

  const structuredAnswers = entries
    .map(({ label, value }) => `${label}:\n${value}`)
    .join('\n\n')


  return `Generated on: ${today}

  Document Type Context:
  ${systemPrompt.trim() || '[not provided]'}

  Submitted Information:
  ${structuredAnswers}
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

    const creditsPerDocument = await getCreditsPerDocumentForUser(user.id)

    const credits = await getUserCredits(user.id)

    if (Number(credits.credits_available) < creditsPerDocument) {
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
       const message = String(aiError?.message || '')
        const normalizedMessage = message.toLowerCase()

        // Per product requirement, any AI provider failure should gracefully fall back
        // to a deterministic document built from submitted form fields.
        console.warn('[v0] Falling back to rule-based document generation due to AI provider error.', {
          reason: message || 'unknown',
        })

        const isAuthOrConfigIssue =
          normalizedMessage.includes('api key') ||
          normalizedMessage.includes('authentication') ||
          normalizedMessage.includes('unauthorized') ||
          normalizedMessage.includes('access failed') ||
          normalizedMessage.includes('gateway') ||
          normalizedMessage.includes('provider')

        if (isAuthOrConfigIssue) {
          console.warn('[v0] AI auth/config/provider issue detected; using fallback document generation.')
        }
        generatedWithFallback = true
        text = createFallbackDocument(systemPrompt, entries)
      }
    }      

    const templateName = await getTemplateName(templateId)

    const documentId = await createDocument({
      userId: user.id,
      templateId,
      templateName,
      content: text,
      userInputs,
      creditsPerDocument,
    })

    await deductUserCredits(user.id, creditsPerDocument)

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
