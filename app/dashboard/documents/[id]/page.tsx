import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DocumentEditor } from '@/components/document-editor'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = params
  const user = await requireAuth().catch(() => null)
  
  if (!user) {
    redirect('/login')
  }

  const documentId = parseInt(id)
  if (isNaN(documentId) || documentId <= 0) {
    notFound()
  }

  const documents = await sql`
    SELECT d.*, t.name as template_name, c.name as category_name
    FROM documents d
    LEFT JOIN templates t ON d.template_id = t.id
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE d.id = ${documentId} AND d.user_id = ${user.id}
  `

  if (documents.length === 0) {
    notFound()
  }

  const document = documents[0]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <DocumentEditor 
        document={{
          id: document.id,
          title: document.title,
          content: document.content,
          categoryName: document.category_name,
          createdAt: document.created_at,
          fontPreference: document.font_preference || 'times',
          textColor: document.text_color || '#000000',
          fontSize: document.font_size || 12,
          textBold: document.text_bold || false,
          textItalic: document.text_italic || false,
        }}
      />

      <Footer />
    </div>
  )
}
