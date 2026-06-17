'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, FileText } from 'lucide-react'
import { useState } from 'react'
import { BundlePurchaseModal } from '@/components/bundle-purchase-modal'

type DocumentBundleCardProps = {
  id: string
  name: string
  description: string
  documentCount: number
  price: number
  isPopular?: boolean
}

export function DocumentBundleCard({
  id,
  name,
  description,
  documentCount,
  price,
  isPopular = false
}: DocumentBundleCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  return (
    <>
      <Card className={`flex flex-col relative ${isPopular ? 'border-primary shadow-lg' : ''}`}>
        {isPopular && (
          <div className="absolute -top-2 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Most Popular
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{name}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-3xl sm:text-4xl font-bold mb-4">
            £{price.toFixed(2)}
          </div>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Get {documentCount} {documentCount === 1 ? 'document' : 'documents'}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{documentCount} documents included</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Never expires</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Use anytime</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full cursor-pointer"
            variant={isPopular ? 'default' : 'outline'}
            onClick={() => setShowPurchaseModal(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Get {documentCount} Documents
          </Button>
        </CardFooter>
      </Card>

      <BundlePurchaseModal
        open={showPurchaseModal}
        onOpenChange={setShowPurchaseModal}
        bundleName={name}
        bundlePrice={price}
        documentCount={documentCount}
        bundleId={id}
      />
    </>
  )
}
