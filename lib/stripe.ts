import 'server-only'
import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
    
    if (!stripeSecretKey) {
      console.warn('[v0] STRIPE_SECRET_KEY is not set. Stripe functionality will not work.')
      // Return a dummy instance that will fail at runtime if actually used
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.')
    }
    
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  }
  
  return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    const instance = getStripe()
    const value = instance[prop as keyof Stripe]
    
    if (typeof value === 'function') {
      return value.bind(instance)
    }
    
    return value
  }
})
