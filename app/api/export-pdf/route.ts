import { sql } from '@/lib/db'
import { generatePDF } from '@/lib/pdf-generator'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const docId = searchParams.get('docId')

    if (!docId) {
      return NextResponse.json(
        { error: 'docId parameter required' },
        { status: 400 }
      )
    }

    // Fetch document with all details
    const documents = await sql`
      SELECT 
        d.id, 
        d.title, 
        d.content,
        d.user_inputs,
        d.created_at,
        u.email,
        u.full_name,
        t.name as template_name
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.id = ${parseInt(docId)}
    `

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    const document = documents[0]
    
    // Generate PDF with user inputs and content
    const pdfBuffer = generatePDF(
      document.title || 'Document',
      document.user_inputs || {},
      document.content || 'No content available'
    )

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(document.title)}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error: any) {
    console.error('[v0] PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to export document' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { documentId } = await req.json()

    // Fetch document
    const documents = await sql`
      SELECT 
        d.id, 
        d.title, 
        d.content,
        d.user_inputs,
        d.created_at,
        u.email,
        u.full_name,
        t.name as template_name
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.id = ${documentId}
    `

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    const document = documents[0]
    
    // Generate PDF
    const pdfBuffer = generatePDF(
      document.title || 'Document',
      document.user_inputs || {},
      document.content || 'No content available'
    )

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(document.title)}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('[v0] PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to export document' },
      { status: 500 }
    )
  }
}

function sanitizeFilename(name: string): string {
  return (name || 'document')
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50)
}
