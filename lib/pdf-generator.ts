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
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`
  )
  
  // Object 4: Content Stream
  objects.push(
    `4 0 obj\n<< /Length ${contentLength} >>\nstream\n${contentStream}\nendstream\nendobj`
  )
  
  // Object 5: Font
  objects.push(
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`
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
  
  stream.push('BT')
  stream.push('/F1 22 Tf')
  stream.push('50 750 Td')
  stream.push(`(${escapeText(title)}) Tj`)
  stream.push('ET')
  
  // Subtitle
  stream.push('BT')
  stream.push('/F1 9 Tf')
  stream.push('50 730 Td')
  stream.push('(Generated Document - MOZERO) Tj')
  stream.push('ET')
  
  // Line separator
  stream.push('1 w')
  stream.push('0.75 0.75 0.75 RG')
  stream.push('50 720 m')
  stream.push('562 720 l')
  stream.push('S')
  
  let yPos = 700
  
  // User Inputs Section
  if (userInputs && Object.keys(userInputs).length > 0) {
    stream.push('BT')
    stream.push('/F1 11 Tf')
    stream.push(`50 ${yPos} Td`)
    stream.push('(CUSTOMER INFORMATION) Tj')
    stream.push('ET')
    yPos -= 20
    
    Object.entries(userInputs).forEach(([key, value]: [string, any]) => {
      if (yPos < 100) return
      
      const label = formatLabel(key)
      const val = String(value || 'N/A').substring(0, 60)
      
      stream.push('BT')
      stream.push('/F1 9 Tf')
      stream.push(`50 ${yPos} Td`)
      stream.push(`(${escapeText(label)}: ${escapeText(val)}) Tj`)
      stream.push('ET')
      yPos -= 14
    })
  }
  
  yPos -= 15
  
  // Content Section
  stream.push('BT')
  stream.push('/F1 11 Tf')
  stream.push(`50 ${yPos} Td`)
  stream.push('(DOCUMENT CONTENT) Tj')
  stream.push('ET')
  yPos -= 18
  
  // Add content with wrapping
  const lines = wrapTextToLines(content, 85)
  lines.forEach(line => {
    if (yPos < 40) return
    
    stream.push('BT')
    stream.push('/F1 9 Tf')
    stream.push(`50 ${yPos} Td`)
    stream.push(`(${escapeText(line)}) Tj`)
    stream.push('ET')
    yPos -= 12
  })
  
  // Footer
  stream.push('BT')
  stream.push('/F1 8 Tf')
  stream.push('50 25 Td')
  stream.push(`(Generated: ${timestamp} | MOZERO Legal Document) Tj`)
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

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/^./, char => char.toUpperCase())
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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
