'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { startCheckoutSession } from '@/app/actions/stripe'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type CheckoutButtonProps = {
  productId: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost'
}

export function CheckoutButton({ productId, label = 'Purchase', variant = 'default' }: CheckoutButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  
  const fetchClientSecret = useCallback(() => startCheckoutSession(productId), [productId])

  const handleSuccess = () => {
    setIsOpen(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <>
      <Button 
        variant={variant} 
        className="w-full" 
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
          </DialogHeader>
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ 
              fetchClientSecret,
              onComplete: handleSuccess
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
