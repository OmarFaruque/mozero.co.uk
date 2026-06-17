import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { FileText, Zap } from 'lucide-react'
import { DocumentBundleCard } from '@/components/document-bundle-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function PricingDemoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">Simple, Transparent Pricing</h1>
              <p className="text-base sm:text-lg text-muted-foreground text-balance px-2">
                Choose between pay-per-use credits or monthly subscriptions. No hidden fees.
              </p>
            </div>
          </div>
        </section>

        {/* Credit Packages */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-3">
              <Zap className="h-3 w-3 mr-1" />
              Pay Per Use
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Credit Packages</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Buy credits as needed. Credits never expire.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="bg-muted/50">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">Loading credit packages...</p>
                <p className="text-xs text-muted-foreground">
                  Note: Credit packages are loaded from the database. Please ensure DATABASE_URL is configured.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Document Bundles */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-3">
              <FileText className="h-3 w-3 mr-1" />
              Document Bundles
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Buy Documents in Bulk</h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Purchase document bundles and use them whenever you need. Never expire.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
            <DocumentBundleCard
              id="bundle-5"
              name="Starter"
              description="Perfect for trying it out"
              documentCount={5}
              price={14.93}
            />
            <DocumentBundleCard
              id="bundle-10"
              name="Basic"
              description="Great value"
              documentCount={10}
              price={23.89}
              isPopular
            />
            <DocumentBundleCard
              id="bundle-25"
              name="Professional"
              description="For regular users"
              documentCount={25}
              price={52.90}
            />
            <DocumentBundleCard
              id="bundle-50"
              name="Premium"
              description="Best for teams"
              documentCount={50}
              price={82.54}
            />
            <DocumentBundleCard
              id="bundle-100"
              name="Enterprise"
              description="Maximum value"
              documentCount={100}
              price={176.28}
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What are document bundles?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Document bundles allow you to purchase a set number of documents upfront at a discounted rate compared to pay-per-use credits. These documents never expire and can be used anytime.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I apply a coupon to my bundle purchase?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! When purchasing any document bundle, you&apos;ll be prompted to enter a coupon code if you have one. Valid coupons will automatically apply a discount to your order.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do I top up my document balance?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You can top up your document balance directly from your dashboard using the &quot;Top Up Documents&quot; button. Choose a preset amount or enter a custom amount to add documents to your account.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do unused documents carry over?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! Documents purchased through bundles never expire. You can use them anytime, and unused documents will always be available in your account.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
