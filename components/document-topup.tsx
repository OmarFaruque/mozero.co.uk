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
  const [customAmount, setCustomAmount] = useState('')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const presetAmounts = [5, 10, 20, 50]

  const handleTopUp = async () => {
    const amount = selectedPreset || parseInt(customAmount)

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setIsProcessing(true)
    try {
      // Create a dynamic product ID for the document top-up
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

  const topUpAmount = selectedPreset || (customAmount ? parseInt(customAmount) : 0)
  const estimatedCost = (topUpAmount * 0.15).toFixed(2) // Rough estimate: £0.15 per document

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
            <DialogTitle>Top Up Document Balance</DialogTitle>
            <DialogDescription>
              Add documents to your account balance
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Add Buttons */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Add</Label>
              <div className="grid grid-cols-4 gap-2">
                {presetAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedPreset === amount ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedPreset(amount)
                      setCustomAmount('')
                    }}
                    disabled={isProcessing}
                    className="text-xs h-10"
                  >
                    +{amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount" className="text-sm font-medium">
                Custom Amount
              </Label>
              <Input
                id="custom-amount"
                type="number"
                min="1"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedPreset(null)
                }}
                disabled={isProcessing}
              />
            </div>

            {/* Summary */}
            {topUpAmount > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Documents to add</span>
                      <span className="font-semibold">{topUpAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost per document</span>
                      <span className="text-muted-foreground">~£0.15</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Estimated Total</span>
                        <span className="text-primary">£{estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Message */}
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                Documents never expire. Use them anytime to generate documents.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowTopUpModal(false)
                  setCustomAmount('')
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
                {isProcessing ? 'Processing...' : `Add ${topUpAmount || 0} Documents`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
