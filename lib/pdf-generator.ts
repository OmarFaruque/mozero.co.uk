/**
 * PDF Generator - Creates valid PDF files with professional formatting
 * Generates PDF with filled user inputs and document content
 */

export function generatePDF(title: string, userInputs: any, content: string): Buffer {
  const timestamp = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Build the PDF content
  const pdfBody = buildPDFBody(title, userInputs, content, timestamp)
  const pdf = Buffer.from(pdfBody, 'latin1')
  
  return pdf
}

function buildPDFBody(title: string, userInputs: any, content: string, timestamp: string): string {
  const objects: string[] = []
  
  // Object 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj')
  
  // Object 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj')
  
  // Build page content stream
  const contentStream = generateContentStream(title, userInputs, content, timestamp)
  const contentLength = contentStream.length
  
  // Object 3: Page
  objects.push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj`
  )
  
  // Object 4: Content Stream
  objects.push(
    `4 0 obj\n<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream\nendobj`
  )
  
  // Object 5: Font (Regular)
  objects.push(
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`
  )
  
  // Object 6: Font (Bold)
  objects.push(
    `6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj`
  )
  
  // Calculate byte offsets
  const offsets: number[] = []
  let currentOffset = 0
  
  const header = '%PDF-1.4\n'
  currentOffset = header.length
  
  objects.forEach((obj, index) => {
    offsets.push(currentOffset)
    currentOffset += obj.length + 1 // +1 for newline
  })
  
  // Build xref table
  let xref = `${currentOffset}\nxref\n0 ${objects.length + 1}\n`
  xref += '0000000000 65535 f \n'
  offsets.forEach(offset => {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  
  // Build trailer
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${currentOffset}\n%%EOF`
  
  return header + objects.join('\n') + '\n' + xref + trailer
}

function generateContentStream(title: string, userInputs: any, content: string, timestamp: string): string {
  const stream: string[] = []
  
  // Set line width
  stream.push('0.5 w')
  
  // HEADER SECTION
  stream.push('BT')
  stream.push('/F2 32 Tf')
  stream.push('40 750 Td')
  stream.push('0.13 0.25 0.64 rg')
  stream.push(`(${escapeText(title)}) Tj`)
  stream.push('ET')
  
  // Company name
  stream.push('BT')
  stream.push('/F1 11 Tf')
  stream.push('0.4 0.4 0.4 rg')
  stream.push('40 730 Td')
  stream.push('(MOZERO - Legal Document Generation) Tj')
  stream.push('ET')
  
  // Horizontal line
  stream.push('0.13 0.25 0.64 RG')
  stream.push('40 725 m')
  stream.push('570 725 l')
  stream.push('S')
  
  let yPos = 710
  
  // METADATA SECTION
  stream.push('BT')
  stream.push('/F1 10 Tf')
  stream.push('0 0 0 rg')
  stream.push(`40 ${yPos} Td`)
  stream.push(`(Generated: ${timestamp}) Tj`)
  stream.push('ET')
  
  yPos -= 25
  
  // CUSTOMER INFORMATION SECTION
  if (userInputs && Object.keys(userInputs).length > 0) {
    stream.push('BT')
    stream.push('/F2 13 Tf')
    stream.push('0.13 0.25 0.64 rg')
    stream.push(`40 ${yPos} Td`)
    stream.push('(CUSTOMER INFORMATION) Tj')
    stream.push('ET')
    
    yPos -= 20
    
    const inputEntries = Object.entries(userInputs)
    
    // Draw background box
    stream.push('0.95 0.95 0.97 rg')
    stream.push('0 0 0 RG')
    stream.push('0.3 w')
    stream.push(`38 ${yPos - (inputEntries.length * 22) - 10} m`)
    stream.push(`572 ${yPos - (inputEntries.length * 22) - 10} l`)
    stream.push(`572 ${yPos + 5} l`)
    stream.push(`38 ${yPos + 5} l`)
    stream.push('f')
    
    // Draw border
    stream.push('0.7 0.7 0.7 RG')
    stream.push('0.5 w')
    stream.push(`38 ${yPos - (inputEntries.length * 22) - 10} m`)
    stream.push(`572 ${yPos - (inputEntries.length * 22) - 10} l`)
    stream.push(`572 ${yPos + 5} l`)
    stream.push(`38 ${yPos + 5} l`)
    stream.push('h')
    stream.push('S')
    
    // Add field entries
    inputEntries.forEach(([key, value]: [string, any], index) => {
      const label = camelCaseToTitleCase(key)
      const val = String(value || 'N/A').substring(0, 70)
      
      // Label (bold)
      stream.push('BT')
      stream.push('/F2 11 Tf')
      stream.push('0.13 0.25 0.64 rg')
      stream.push(`50 ${yPos - (index * 22)} Td`)
      stream.push(`(${escapeText(label)}) Tj`)
      stream.push('ET')
      
      // Value (regular)
      stream.push('BT')
      stream.push('/F1 10 Tf')
      stream.push('0 0 0 rg')
      stream.push(`50 ${yPos - (index * 22) - 14} Td`)
      stream.push(`(${escapeText(val)}) Tj`)
      stream.push('ET')
    })
    
    yPos -= (inputEntries.length * 22) + 25
  }
  
  // DOCUMENT CONTENT SECTION
  stream.push('BT')
  stream.push('/F2 13 Tf')
  stream.push('0.13 0.25 0.64 rg')
  stream.push(`40 ${yPos} Td`)
  stream.push('(DOCUMENT CONTENT) Tj')
  stream.push('ET')
  
  yPos -= 20
  
  stream.push('0 0 0 rg')
  
  // Add content with better wrapping
  const lines = wrapTextToLines(content, 100)
  
  lines.forEach(line => {
    if (yPos < 70) return
    
    stream.push('BT')
    stream.push('/F1 11 Tf')
    stream.push(`40 ${yPos} Td`)
    stream.push(`(${escapeText(line)}) Tj`)
    stream.push('ET')
    
    yPos -= 15
  })
  
  // FOOTER SECTION
  stream.push('0.13 0.25 0.64 RG')
  stream.push('0.5 w')
  stream.push('40 50 m')
  stream.push('570 50 l')
  stream.push('S')
  
  stream.push('0.5 0.5 0.5 rg')
  stream.push('BT')
  stream.push('/F1 9 Tf')
  stream.push('40 35 Td')
  stream.push('(LEGAL DISCLAIMER: This document was generated by MOZERO and does not constitute legal advice.) Tj')
  stream.push('ET')
  
  stream.push('BT')
  stream.push('/F1 8 Tf')
  stream.push('40 23 Td')
  stream.push('(For legal matters, please consult a licensed attorney or solicitor. www.mozero.co.uk) Tj')
  stream.push('ET')
  
  return stream.join('\n')
}

function escapeText(text: string): string {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .substring(0, 200)
}

function camelCaseToTitleCase(str: string): string {
  // Convert camelCase and snake_case to Title Case
  return str
    // Handle camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Handle underscores
    .replace(/_/g, ' ')
    // Capitalize each word
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function wrapTextToLines(text: string, charsPerLine: number): string[] {
  const lines: string[] = []
  const words = String(text).split(/\s+/)
  let currentLine = ''
  
  words.forEach(word => {
    if ((currentLine + word).length > charsPerLine) {
      if (currentLine) lines.push(currentLine.trim())
      currentLine = word
    } else {
      currentLine += (currentLine ? ' ' : '') + word
    }
  })
  
  if (currentLine) lines.push(currentLine.trim())
  return lines.filter(l => l.length > 0)
}

export function generatePDFContent(content: string, title: string, date: string) {
  // Parse the content to extract different sections
  const lines = content.split('\n').filter(line => line.trim() !== '')
  
  return {
    lines,
    metadata: {
      title,
      date,
      disclaimer: 'This document was generated by Mozero and does not constitute legal advice. For legal matters, please consult a licensed attorney or solicitor.'
    }
  }
}

export function formatDateUK(date: Date): string {
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}
