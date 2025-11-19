import { sql } from '@/lib/db'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[v0] Stripe environment variables not configured')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }

  const { stripe } = await import('@/lib/stripe')

  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('[v0] Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (!metadata) break

        const userId = parseInt(metadata.userId)
        const credits = parseInt(metadata.credits)
        const type = metadata.type

        if (type === 'credits') {
          // Add credits to user account
          await sql`
            INSERT INTO user_credits (user_id, credits_available, credits_used)
            VALUES (${userId}, ${credits}, 0)
            ON CONFLICT (user_id)
            DO UPDATE SET
              credits_available = user_credits.credits_available + ${credits},
              updated_at = CURRENT_TIMESTAMP
          `

          // Record transaction
          await sql`
            INSERT INTO transactions (user_id, stripe_payment_id, amount_cents, credits_purchased, transaction_type, status)
            VALUES (${userId}, ${session.payment_intent as string}, ${session.amount_total}, ${credits}, 'credits', 'completed')
          `
        } else if (type === 'subscription' && session.subscription) {
          // Get subscription plan ID
          const planResult = await sql`
            SELECT id FROM subscription_plans WHERE name = ${metadata.productId}
          `
          
          let planId = 1 // Default to first plan if not found
          if (planResult.length > 0) {
            planId = planResult[0].id
          }

          // Create subscription record
          await sql`
            INSERT INTO user_subscriptions (user_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end)
            VALUES (
              ${userId},
              ${planId},
              ${session.subscription as string},
              'active',
              NOW(),
              NOW() + INTERVAL '1 month'
            )
          `

          // Add monthly credits
          await sql`
            INSERT INTO user_credits (user_id, credits_available, credits_used)
            VALUES (${userId}, ${credits}, 0)
            ON CONFLICT (user_id)
            DO UPDATE SET
              credits_available = user_credits.credits_available + ${credits},
              updated_at = CURRENT_TIMESTAMP
          `

          // Record transaction
          await sql`
            INSERT INTO transactions (user_id, stripe_payment_id, amount_cents, transaction_type, status)
            VALUES (${userId}, ${session.payment_intent as string}, ${session.amount_total}, 'subscription', 'completed')
          `
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await sql`
          UPDATE user_subscriptions
          SET status = ${subscription.status},
              updated_at = CURRENT_TIMESTAMP
          WHERE stripe_subscription_id = ${subscription.id}
        `
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
