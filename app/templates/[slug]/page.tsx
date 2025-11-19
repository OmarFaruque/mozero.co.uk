import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, FileText, Clock, CheckCircle } from 'lucide-react'
import { TEMPLATES, CATEGORIES } from '@/lib/static-templates'
import { notFound } from 'next/navigation'
import { TemplateForm } from '@/components/template-form'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TemplatePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  const user = await getCurrentUser()
  if (!user) {
    redirect(`/login?redirect=/templates/${slug}`)
  }

  const templateData = TEMPLATES.find(t => t.slug === slug)
  
  if (!templateData) {
    notFound()
  }

  const category = CATEGORIES.find(c => c.id === templateData.category_id)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <section className="border-b bg-background">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-3">
                {category?.name}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{templateData.name}</h1>
              <p className="text-muted-foreground text-pretty">
                {templateData.description}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8 max-w-6xl">
            <div>
              {/* Legal Disclaimer */}
              <Alert className="mb-6 border-primary/50 bg-primary/5">
                <Shield className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  <strong>Important:</strong> This service generates template-based documents and does not constitute legal advice. 
                  For legal matters, please consult with a licensed attorney.
                </AlertDescription>
              </Alert>

              {/* Template Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Complete the Form</CardTitle>
                  <CardDescription>
                    Answer the questions below to generate your personalized document. All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplateForm 
                    templateId={templateData.id}
                    templateSlug={templateData.slug}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Template Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Estimated Length</p>
                      <p className="text-sm text-muted-foreground">{templateData.estimated_pages}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Time to Complete</p>
                      <p className="text-sm text-muted-foreground">5-10 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Format</p>
                      <p className="text-sm text-muted-foreground">Professional PDF</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {templateData.use_cases && templateData.use_cases.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Common Use Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {templateData.use_cases.map((useCase: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
