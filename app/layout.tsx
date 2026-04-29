import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Letterise - AI-Powered Document Generator',
  description: 'Generate professional dispute letters, insurance claims, complaints, appeals, and official documents using AI. Fast, accurate, and legally sound document generation.',
  keywords: 'dispute letters, insurance claims, complaint letters, appeals, legal documents, AI document generator',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
