import { requireAuth } from '@/lib/auth'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function formatUserInputs(userInputs: any): string {
  if (!userInputs || typeof userInputs !== 'object') return ''

  return Object.entries(userInputs)
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
      const formattedValue = typeof value === 'string' ? escapeHtml(value) : String(value)
      return `<div class="input-field">
        <label>${label}</label>
        <span class="value">${formattedValue}</span>
      </div>`
    })
    .join('')
}

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

    const documents = await sql`
      SELECT d.id, d.title, d.content, d.user_inputs, d.created_at, u.full_name, u.email, t.name as template_name
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
    const generatedDate = new Date(document.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const userInputsHtml = formatUserInputs(document.user_inputs)

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(document.title)}</title>
  <style>
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .document {
        box-shadow: none;
        page-break-after: always;
      }
      @page {
        margin: 0.5in;
        size: A4;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }

    .document {
      max-width: 8.5in;
      height: 11in;
      margin: 0 auto;
      padding: 0.75in;
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      page-break-after: always;
    }

    .header {
      border-bottom: 3px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header-logo {
      font-size: 24px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 8px;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #000;
      margin-bottom: 5px;
    }

    .header-subtitle {
      font-size: 12px;
      color: #666;
    }

    .metadata {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 25px;
      font-size: 12px;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
    }

    .metadata-label {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
    }

    .metadata-value {
      color: #333;
      word-break: break-word;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e40af;
      margin-top: 25px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .inputs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .input-field {
      padding: 10px;
      background: #f9fafb;
      border-radius: 4px;
      border-left: 3px solid #1e40af;
    }

    .input-field label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-field .value {
      display: block;
      font-size: 13px;
      color: #333;
      word-wrap: break-word;
      word-break: break-word;
    }

    .document-content {
      margin-bottom: 25px;
      font-size: 12px;
      line-height: 1.8;
      color: #444;
    }

    .document-content p {
      margin-bottom: 12px;
      text-align: justify;
    }

    .footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 25px;
      font-size: 10px;
      color: #666;
      text-align: center;
    }

    .footer-line {
      margin-bottom: 4px;
    }

    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 100px;
      color: rgba(30, 64, 175, 0.05);
      z-index: -1;
      width: 100%;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
    }

    .signature-block {
      margin-top: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .signature-line {
      border-top: 1px solid #333;
      padding-top: 8px;
      text-align: center;
      font-size: 11px;
    }

    @media (max-width: 600px) {
      .metadata {
        grid-template-columns: 1fr;
      }
      .inputs-grid {
        grid-template-columns: 1fr;
      }
      .signature-block {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">MOZERO</div>
  
  <div class="document">
    <div class="header">
      <div class="header-logo">MOZERO</div>
      <div class="header-title">${escapeHtml(document.title)}</div>
      <div class="header-subtitle">Generated Legal Document</div>
    </div>

    <div class="metadata">
      <div class="metadata-item">
        <div class="metadata-label">Document ID</div>
        <div class="metadata-value">${document.id}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Template</div>
        <div class="metadata-value">${escapeHtml(document.template_name || 'N/A')}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Client Name</div>
        <div class="metadata-value">${escapeHtml(document.full_name || 'Not specified')}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Generated Date</div>
        <div class="metadata-value">${generatedDate}</div>
      </div>
    </div>

    <div class="section-title">DOCUMENT DETAILS</div>
    <div class="inputs-grid">
      ${userInputsHtml}
    </div>

    <div class="section-title">DOCUMENT CONTENT</div>
    <div class="document-content">
      ${document.content
        .split('\n\n')
        .map((para: string) => `<p>${escapeHtml(para.trim())}</p>`)
        .join('')}
    </div>

    <div class="footer">
      <div class="footer-line"><strong>LEGAL DISCLAIMER</strong></div>
      <div class="footer-line">This document was generated by Mozero and does not constitute legal advice.</div>
      <div class="footer-line">For legal matters, please consult a licensed attorney or solicitor.</div>
      <div class="footer-line" style="margin-top: 8px;">Mozero.com • Generated on ${generatedDate}</div>
    </div>

    <div class="signature-block">
      <div class="signature-line">Client Signature / Date</div>
      <div class="signature-line">Authorized Representative / Date</div>
    </div>
  </div>

  <script>
    // Auto-print on load if requested
    if (window.location.hash === '#print') {
      window.print()
    }
  </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${document.title.replace(/[^a-z0-9]/gi, '_')}.html"`,
      },
    })
  } catch (error: any) {
    console.error('[v0] Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export document' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    const { documentId } = await req.json()

    const documents = await sql`
      SELECT d.id, d.title, d.content, d.user_inputs, d.created_at, u.full_name, u.email, t.name as template_name
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN templates t ON d.template_id = t.id
      WHERE d.id = ${documentId} AND d.user_id = ${user.id}
    `

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    const document = documents[0]
    const generatedDate = new Date(document.created_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const userInputsHtml = formatUserInputs(document.user_inputs)

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(document.title)}</title>
  <style>
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      body {
        margin: 0;
        padding: 0;
      }
      .document {
        box-shadow: none;
        page-break-after: always;
      }
      @page {
        margin: 0.5in;
        size: A4;
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      background: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
      color: #333;
    }

    .document {
      max-width: 8.5in;
      height: 11in;
      margin: 0 auto;
      padding: 0.75in;
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      page-break-after: always;
    }

    .header {
      border-bottom: 3px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .header-logo {
      font-size: 24px;
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 8px;
    }

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #000;
      margin-bottom: 5px;
    }

    .header-subtitle {
      font-size: 12px;
      color: #666;
    }

    .metadata {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 15px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 25px;
      font-size: 12px;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
    }

    .metadata-label {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
    }

    .metadata-value {
      color: #333;
      word-break: break-word;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e40af;
      margin-top: 25px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .inputs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }

    .input-field {
      padding: 10px;
      background: #f9fafb;
      border-radius: 4px;
      border-left: 3px solid #1e40af;
    }

    .input-field label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input-field .value {
      display: block;
      font-size: 13px;
      color: #333;
      word-wrap: break-word;
      word-break: break-word;
    }

    .document-content {
      margin-bottom: 25px;
      font-size: 12px;
      line-height: 1.8;
      color: #444;
    }

    .document-content p {
      margin-bottom: 12px;
      text-align: justify;
    }

    .footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      margin-top: 25px;
      font-size: 10px;
      color: #666;
      text-align: center;
    }

    .footer-line {
      margin-bottom: 4px;
    }

    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 100px;
      color: rgba(30, 64, 175, 0.05);
      z-index: -1;
      width: 100%;
      text-align: center;
      white-space: nowrap;
      pointer-events: none;
    }

    .signature-block {
      margin-top: 30px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }

    .signature-line {
      border-top: 1px solid #333;
      padding-top: 8px;
      text-align: center;
      font-size: 11px;
    }

    @media (max-width: 600px) {
      .metadata {
        grid-template-columns: 1fr;
      }
      .inputs-grid {
        grid-template-columns: 1fr;
      }
      .signature-block {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="watermark">MOZERO</div>
  
  <div class="document">
    <div class="header">
      <div class="header-logo">MOZERO</div>
      <div class="header-title">${escapeHtml(document.title)}</div>
      <div class="header-subtitle">Generated Legal Document</div>
    </div>

    <div class="metadata">
      <div class="metadata-item">
        <div class="metadata-label">Document ID</div>
        <div class="metadata-value">${document.id}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Template</div>
        <div class="metadata-value">${escapeHtml(document.template_name || 'N/A')}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Client Name</div>
        <div class="metadata-value">${escapeHtml(document.full_name || 'Not specified')}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">Generated Date</div>
        <div class="metadata-value">${generatedDate}</div>
      </div>
    </div>

    <div class="section-title">DOCUMENT DETAILS</div>
    <div class="inputs-grid">
      ${userInputsHtml}
    </div>

    <div class="section-title">DOCUMENT CONTENT</div>
    <div class="document-content">
      ${document.content
        .split('\n\n')
        .map((para: string) => `<p>${escapeHtml(para.trim())}</p>`)
        .join('')}
    </div>

    <div class="footer">
      <div class="footer-line"><strong>LEGAL DISCLAIMER</strong></div>
      <div class="footer-line">This document was generated by Mozero and does not constitute legal advice.</div>
      <div class="footer-line">For legal matters, please consult a licensed attorney or solicitor.</div>
      <div class="footer-line" style="margin-top: 8px;">Mozero.com • Generated on ${generatedDate}</div>
    </div>

    <div class="signature-block">
      <div class="signature-line">Client Signature / Date</div>
      <div class="signature-line">Authorized Representative / Date</div>
    </div>
  </div>

  <script>
    // Auto-print on load if requested
    if (window.location.hash === '#print') {
      window.print()
    }
  </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${document.title.replace(/[^a-z0-9]/gi, '_')}.html"`,
      },
    })
  } catch (error: any) {
    console.error('[v0] Export error:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to export document' },
      { status: 500 }
    )
  }
}
