'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

type BundlePurchaseModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bundleName: string
  bundlePrice: number
  documentCount: number
}

export function BundlePurchaseModal({
  open,
  onOpenChange,
  bundleName,
  bundlePrice,
  documentCount
}: BundlePurchaseModalProps) {
  const [step, setStep] = useState<'coupon' | 'confirm'>('coupon')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const finalPrice = bundlePrice - discountAmount

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code')
      return
    }

    setIsProcessing(true)
    // Simulate API call
    setTimeout(() => {
      if (couponCode.toLowerCase() === 'demo10') {
        const discount = bundlePrice * 0.1
        setDiscountAmount(discount)
        setCouponApplied(true)
        setIsProcessing(false)
        setStep('confirm')
      } else {
        alert('Invalid coupon code. Try "demo10" for demo.')
        setIsProcessing(false)
      }
    }, 500)
  }

  const handleSkipCoupon = () => {
    setCouponApplied(true)
    setDiscountAmount(0)
    setStep('confirm')
  }

  const handleConfirmPurchase = () => {
    setIsProcessing(true)
    // Simulate purchase
    setTimeout(() => {
      alert(`Purchase successful! You now have ${documentCount} documents.\n\nThis is a demo - no actual transaction occurred.`)
      setIsProcessing(false)
      onOpenChange(false)
      // Reset modal state
      setStep('coupon')
      setCouponCode('')
      setCouponApplied(false)
      setDiscountAmount(0)
    }, 1000)
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
                  Tip: Try "demo10" for a 10% discount demo
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

              {/* Payment Method Info (Demo) */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <Label className="text-xs font-semibold text-muted-foreground mb-2 block">
                    Payment Method (Demo)
                  </Label>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="w-8 h-5 bg-primary/20 rounded flex items-center justify-center text-xs font-bold text-primary">
                      CARD
                    </div>
                    <span className="text-sm">•••• •••• •••• 4242</span>
                  </div>
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
                This is a demo - no actual payment will be processed
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
