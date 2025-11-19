export type Product = {
  id: string
  name: string
  description: string
  priceInCents: number
  credits?: number
  type: 'credits' | 'subscription'
  features?: string[]
}

export const PRODUCTS: Product[] = [
  // Credit Packages
  {
    id: '10-credits',
    name: '10 Credits',
    description: 'Generate 10 documents',
    priceInCents: 799, // £7.99
    credits: 10,
    type: 'credits'
  },
  {
    id: '25-credits',
    name: '25 Credits',
    description: 'Generate 25 documents',
    priceInCents: 1599, // £15.99
    credits: 25,
    type: 'credits'
  },
  {
    id: '50-credits',
    name: '50 Credits',
    description: 'Generate 50 documents - Best Value',
    priceInCents: 2399, // £23.99
    credits: 50,
    type: 'credits'
  },
  
  // Subscription Plans
  {
    id: 'basic-plan',
    name: 'Basic Plan',
    description: 'Perfect for occasional users',
    priceInCents: 1599, // £15.99/month
    credits: 40,
    type: 'subscription',
    features: [
      '40 documents per month',
      'All document templates',
      'PDF export',
      'Email support'
    ]
  },
  {
    id: 'professional-plan',
    name: 'Professional Plan',
    description: 'For regular users',
    priceInCents: 3999, // £39.99/month
    credits: 250,
    type: 'subscription',
    features: [
      '250 documents per month',
      'All document templates',
      'PDF export',
      'Priority email support',
      'Document revision history'
    ]
  },
  {
    id: 'business-plan',
    name: 'Business Plan',
    description: 'Unlimited document generation',
    priceInCents: 7999, // £79.99/month
    credits: 999,
    type: 'subscription',
    features: [
      'Unlimited documents',
      'All document templates',
      'PDF export',
      'Priority support',
      'Document revision history',
      'API access',
      'Team collaboration'
    ]
  }
]
