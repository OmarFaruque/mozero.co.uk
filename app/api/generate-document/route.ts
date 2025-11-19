import { generateText } from 'ai'
import { requireAuth } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const { templateId, systemPrompt, userInputs } = await req.json()

    if (!templateId || !systemPrompt || !userInputs) {
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
    const inputsText = Object.entries(userInputs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    // Generate the document using AI
    const { text } = await generateText({
      model: 'openai/gpt-4o',
      prompt: `${systemPrompt}

User Information:
${inputsText}

Please generate a professional, formal letter following UK business letter format. Structure it as follows:

1. Start with sender's address (right-aligned if provided, otherwise skip)
2. Date (current date formatted as: [Day] [Month] [Year], e.g., 15 January 2025)
3. Recipient's name and address (left-aligned)
4. Subject line (if applicable, in bold: Re: [Subject])
5. Formal salutation (Dear [Name] or Dear Sir/Madam)
6. Opening paragraph stating the purpose clearly
7. Body paragraphs with:
   - Clear explanation of the situation
   - Relevant facts and dates
   - Reference to relevant laws/regulations (Consumer Rights Act 2015, etc.)
   - Supporting evidence or documentation
8. Closing paragraph with:
   - Clear statement of desired resolution
   - Reasonable deadline for response (typically 14 days)
   - Mention of escalation if necessary
9. Professional closing: "Yours sincerely" (if named) or "Yours faithfully" (if not)
10. Signature line

Use professional, assertive but respectful language. Include specific dates, amounts, and reference numbers where provided. Make the letter clear, concise, and legally sound while remaining non-threatening.

Generate the complete, properly formatted letter now:`,
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    // Get template name for the document title
    const template = await sql`
      SELECT name FROM templates WHERE id = ${templateId}
    `

    // Save the generated document
    const result = await sql`
      INSERT INTO documents (user_id, template_id, title, content, user_inputs, status, credits_used)
      VALUES (
        ${user.id},
        ${templateId},
        ${template[0].name},
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
    })
  } catch (error: any) {
    console.error('[v0] Document generation error:', error)
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate document. Please try again.' },
      { status: 500 }
    )
  }
}
