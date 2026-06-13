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
  
  // Set line width and colors
  stream.push('0.5 w')
  stream.push('0.13 0.25 0.64 RG') // Blue color for headers (RGB)
  
  // HEADER SECTION
  stream.push('BT')
  stream.push('/F1 28 Tf')
  stream.push('40 750 Td')
  stream.push(`(${escapeText(title)}) Tj`)
  stream.push('ET')
  
  // Company name
  stream.push('BT')
  stream.push('/F1 10 Tf')
  stream.push('40 730 Td')
  stream.push('(MOZERO Legal Document Generation) Tj')
  stream.push('ET')
  
  // Horizontal line
  stream.push('40 725 m')
  stream.push('570 725 l')
  stream.push('S')
  
  let yPos = 710
  
  // METADATA SECTION
  stream.push('BT')
  stream.push('/F1 10 Tf')
  stream.push('0 0 0 rg') // Black text
  stream.push(`40 ${yPos} Td`)
  stream.push(`(Generated: ${timestamp}) Tj`)
  stream.push('ET')
  
  yPos -= 20
  
  // CUSTOMER INFORMATION SECTION
  if (userInputs && Object.keys(userInputs).length > 0) {
    stream.push('0.13 0.25 0.64 RG') // Blue for section header
    stream.push('BT')
    stream.push('/F1 12 Tf')
    stream.push(`40 ${yPos} Td`)
    stream.push('(CUSTOMER INFORMATION) Tj')
    stream.push('ET')
    
    yPos -= 18
    
    // Background box for customer info
    stream.push('0.93 0.93 0.95 rg') // Light gray background
    stream.push(`40 ${yPos - 5} m`)
    stream.push(`570 ${yPos - 5} l`)
    stream.push(`570 ${yPos - (Object.keys(userInputs).length * 16) - 10} l`)
    stream.push(`40 ${yPos - (Object.keys(userInputs).length * 16) - 10} l`)
    stream.push('f')
    
    stream.push('0 0 0 rg') // Black text
    const inputEntries = Object.entries(userInputs).slice(0, 10) // Limit to 10 fields
    
    inputEntries.forEach(([key, value]: [string, any], index) => {
      const label = formatLabel(key)
      const val = String(value || 'N/A').substring(0, 55)
      
      stream.push('BT')
      stream.push('/F1 10 Tf')
      stream.push(`50 ${yPos - (index * 16)} Td`)
      stream.push(`(${escapeText(label)}: ) Tj`)
      
      stream.push('0.3 0.3 0.3 rg') // Dark gray for values
      stream.push(`(${escapeText(val)}) Tj`)
      stream.push('ET')
    })
    
    yPos -= (inputEntries.length * 16) + 20
  }
  
  // DOCUMENT CONTENT SECTION
  stream.push('0.13 0.25 0.64 RG') // Blue for section header
  stream.push('BT')
  stream.push('/F1 12 Tf')
  stream.push(`40 ${yPos} Td`)
  stream.push('(DOCUMENT CONTENT) Tj')
  stream.push('ET')
  
  yPos -= 18
  
  stream.push('0 0 0 rg') // Black text
  
  // Add content with better wrapping
  const lines = wrapTextToLines(content, 95)
  let contentLines = 0
  
  lines.forEach(line => {
    if (yPos < 60) return
    
    stream.push('BT')
    stream.push('/F1 11 Tf')
    stream.push(`40 ${yPos} Td`)
    stream.push(`(${escapeText(line)}) Tj`)
    stream.push('ET')
    
    yPos -= 14
    contentLines++
  })
  
  // FOOTER SECTION
  stream.push('0.13 0.25 0.64 RG') // Blue line
  stream.push('40 45 m')
  stream.push('570 45 l')
  stream.push('S')
  
  stream.push('0.5 0.5 0.5 rg') // Gray text for footer
  stream.push('BT')
  stream.push('/F1 9 Tf')
  stream.push('40 30 Td')
  stream.push('(LEGAL DISCLAIMER: This document was generated by Mozero and does not constitute legal advice.) Tj')
  stream.push('ET')
  
  stream.push('BT')
  stream.push('/F1 8 Tf')
  stream.push('40 18 Td')
  stream.push('(For legal matters, please consult a licensed attorney or solicitor. Visit www.mozero.co.uk) Tj')
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
