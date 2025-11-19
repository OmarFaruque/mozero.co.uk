'use server'

import { requireAuth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { sql } from '@/lib/db'

export async function startCheckoutSession(productId: string) {
  const user = await requireAuth()
  const product = PRODUCTS.find(p => p.id === productId)
  
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  if (product.type === 'credits') {
    // One-time payment for credits
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        userId: user.id.toString(),
        productId: product.id,
        credits: product.credits?.toString() || '0',
        type: 'credits'
      }
    })

    return session.client_secret
  } else {
    // Subscription
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        userId: user.id.toString(),
        productId: product.id,
        credits: product.credits?.toString() || '0',
        type: 'subscription'
      }
    })

    return session.client_secret
  }
}

export async function createPortalSession() {
  const user = await requireAuth()
  
  // Get Stripe customer ID
  const subscription = await sql`
    SELECT stripe_subscription_id FROM user_subscriptions
    WHERE user_id = ${user.id} AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (subscription.length === 0 || !subscription[0].stripe_subscription_id) {
    throw new Error('No active subscription found')
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscription[0].stripe_subscription_id)
  
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeSubscription.customer as string,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
  })

  return portalSession.url
}
