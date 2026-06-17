import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, FileText, CreditCard, File } from 'lucide-react'
import { DocumentTopUp } from '@/components/document-topup'

export default function DashboardDemoPage() {
  const currentDocuments = 42

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage your documents and account</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
            {/* Available Credits */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Credits
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
                <p className="text-xs text-muted-foreground">
                  25 credits used
                </p>
              </CardContent>
            </Card>

            {/* Document Balance - Our New Component */}
            <DocumentTopUp currentDocuments={currentDocuments} />

            {/* Total Documents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Documents
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  All time
                </p>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscription
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Pro</div>
                <p className="text-xs text-muted-foreground">
                  500 credits/month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Documents */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Recent Documents</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Your latest creations</p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Product Requirements', created: '2 hours ago', status: 'Completed' },
                { name: 'Marketing Proposal', created: '1 day ago', status: 'Completed' },
                { name: 'Technical Spec', created: '3 days ago', status: 'Completed' },
              ].map((doc) => (
                <Card key={doc.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <File className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <CardTitle className="text-base">{doc.name}</CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {doc.created}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-xs">{doc.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
