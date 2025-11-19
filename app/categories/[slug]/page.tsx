import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, Star, FileText } from 'lucide-react'
import { sql } from '@/lib/db'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  const category = await sql`
    SELECT * FROM categories
    WHERE slug = ${slug} AND is_active = true
  `

  if (category.length === 0) {
    notFound()
  }

  const templates = await sql`
    SELECT * FROM templates
    WHERE category_id = ${category[0].id} AND is_active = true
    ORDER BY is_featured DESC, name ASC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container mx-auto py-12 md:py-16">
            <div className="max-w-3xl">
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
                ← Back to Categories
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{category[0].name}</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                {category[0].description}
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: any) => (
              <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  {template.is_featured && (
                    <Badge className="w-fit mb-2" variant="default">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  {template.use_cases && template.use_cases.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Use Cases:</p>
                      <ul className="space-y-1">
                        {template.use_cases.slice(0, 3).map((useCase: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start">
                            <span className="mr-2">•</span>
                            <span>{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {template.estimated_length && (
                    <p className="text-sm text-muted-foreground mt-3">
                      <FileText className="inline h-3 w-3 mr-1" />
                      {template.estimated_length}
                    </p>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/templates/${template.slug}`}>
                      Use Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <Card className="p-12 text-center">
              <CardContent>
                <p className="text-muted-foreground">No templates available in this category yet.</p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
