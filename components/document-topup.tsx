'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { startCheckoutSession } from '@/app/actions/stripe'

type DocumentTopUpProps = {
  currentDocuments?: number
}

export function DocumentTopUp({ currentDocuments = 0 }: DocumentTopUpProps) {
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [priceAmount, setPriceAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [10, 25, 50, 100] // Preset prices in £

  const handleTopUp = async () => {
    const amount = selectedPreset || (priceAmount ? parseFloat(priceAmount) : null)

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setIsProcessing(true)
    try {
      // Create a dynamic product ID for the balance top-up with price
      const productId = `topup-${amount}`
      const result = await startCheckoutSession(productId)
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

  const topUpAmount = selectedPreset || (priceAmount ? parseFloat(priceAmount) : 0)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-medium">
              Available Documents
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Documents you can generate
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">{currentDocuments}</div>
          <Button 
            variant="outline" 
            className="w-full cursor-pointer"
            onClick={() => setShowTopUpModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Top Up Documents
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Top Up Balance</DialogTitle>
            <DialogDescription>
              Choose an amount to add to your account balance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Add Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Amount</Label>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedPreset === amount ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPreset(amount)
                      setPriceAmount('')
                    }}
                    disabled={isProcessing}
                    className="text-xs h-10"
                  >
                    £{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount" className="text-sm font-medium">
                Custom Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="custom-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={priceAmount}
                  onChange={(e) => {
                    setPriceAmount(e.target.value)
                    setSelectedPreset(null)
                  }}
                  disabled={isProcessing}
                  className="pl-7"
                />
              </div>
            </div>

            {/* Summary */}
            {topUpAmount > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Top Up Amount</span>
                      <span className="font-semibold">£{topUpAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total to Pay</span>
                        <span className="text-primary">£{topUpAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Message */}
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Your balance is added to your account and can be used to generate documents anytime.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowTopUpModal(false)
                  setPriceAmount('')
                  setSelectedPreset(null)
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleTopUp}
                disabled={isProcessing || topUpAmount === 0}
              >
                {isProcessing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isProcessing ? 'Processing...' : `Top Up £${topUpAmount.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
