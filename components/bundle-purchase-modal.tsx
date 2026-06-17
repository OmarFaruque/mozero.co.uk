'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { startCheckoutSession } from '@/app/actions/stripe'

type BundlePurchaseModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bundleName: string
  bundlePrice: number
  documentCount: number
  bundleId: string
}

export function BundlePurchaseModal({
  open,
  onOpenChange,
  bundleName,
  bundlePrice,
  documentCount,
  bundleId
}: BundlePurchaseModalProps) {
  const [step, setStep] = useState<'coupon' | 'confirm'>('coupon')
  const [couponCode, setCouponCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const finalPrice = bundlePrice - discountAmount

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code')
      return
    }

    setIsProcessing(true)
    // In production, validate coupon against backend
    setTimeout(() => {
      // Placeholder for coupon validation
      const validCoupons = ['SAVE10', 'BUNDLE20', 'WELCOME15']
      if (validCoupons.includes(couponCode.toUpperCase())) {
        const discountPercent = couponCode.toUpperCase() === 'BUNDLE20' ? 20 : couponCode.toUpperCase() === 'WELCOME15' ? 15 : 10
        const discount = bundlePrice * (discountPercent / 100)
        setDiscountAmount(discount)
        setIsProcessing(false)
        setStep('confirm')
      } else {
        alert('Invalid coupon code')
        setIsProcessing(false)
      }
    }, 500)
  }

  const handleSkipCoupon = () => {
    setDiscountAmount(0)
    setStep('confirm')
  }

  const handleConfirmPurchase = async () => {
    setIsProcessing(true)
    try {
      const result = await startCheckoutSession(bundleId)
      if (result?.url) {
        window.location.href = result.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'coupon' ? (
          <>
            <DialogHeader>
              <DialogTitle>Checkout</DialogTitle>
              <DialogDescription>
                Complete your purchase of {bundleName}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Order Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>{bundleName}</span>
                      <span>£{bundlePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{documentCount} documents</span>
                    </div>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>£{bundlePrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Input */}
              <div className="space-y-2">
                <Label htmlFor="coupon" className="text-sm font-medium">
                  Have a coupon code? (Optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                    disabled={isProcessing}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyCoupon}
                    disabled={isProcessing || !couponCode.trim()}
                  >
                    {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                    Apply
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Enter your discount code if you have one
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleSkipCoupon}
                  disabled={isProcessing}
                >
                  Continue without coupon
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
              <DialogDescription>
                Review your order before completing payment
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Purchase Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>{bundleName}</span>
                      <span>£{bundlePrice.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-primary">
                        <span>Discount (coupon)</span>
                        <span>-£{discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>£{finalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <Check className="h-4 w-4" />
                        <span>You&apos;ll receive {documentCount} documents immediately</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Info */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                    Continue to Payment
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    You will be redirected to our secure payment processor
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setStep('coupon')}
                  disabled={isProcessing}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConfirmPurchase}
                  disabled={isProcessing}
                >
                  {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isProcessing ? 'Processing...' : `Pay £${finalPrice.toFixed(2)}`}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment powered by Stripe
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
