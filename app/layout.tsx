import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Letterise - AI-Powered Document Generator',
  description: 'Generate professional dispute letters, insurance claims, complaints, appeals, and official documents using AI. Fast, accurate, and legally sound document generation.',
  keywords: 'dispute letters, insurance claims, complaint letters, appeals, legal documents, AI document generator',
    generator: 'v0.app'
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
