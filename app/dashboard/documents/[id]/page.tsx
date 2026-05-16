import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DocumentEditor } from '@/components/document-editor'
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { getDocumentById } from '@/lib/user-dashboard'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type DocumentPageParams = { id: string } | Promise<{ id: string }>

export default async function DocumentPage({ params }: { params: DocumentPageParams }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const user = await requireAuth().catch(() => null)
  
  if (!user) {
    redirect('/login')
  }

  const documentId = parseInt(id)
  if (isNaN(documentId) || documentId <= 0) {
    notFound()
  }

  const document = await getDocumentById(user.id, documentId)

  if (!document) {
    notFound()
  }

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
          userInputs: document.user_inputs || null,
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
