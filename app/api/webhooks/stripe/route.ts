import { sql } from '@/lib/db'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSettings } from '@/lib/admin-settings'
import { addCreditPlanPurchaseForUser } from '@/lib/stripe-webhook-repo'

export async function POST(req: Request) {
  const stripeSettings = await getSettings('stripe')
  const secretKey = stripeSettings?.secret_key || process.env.STRIPE_SECRET_KEY
  const webhookSecret = stripeSettings?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey || !webhookSecret) {
    console.error('Stripe credentials or webhook secret not configured')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
  })

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
      webhookSecret
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
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
        const productId = metadata.productId

        if (type === 'credits') {

          const planId = parseInt(productId.replace('credit-', ''))

          // Track the purchased credit package so generation can use its per-document credit cost.
          if (!Number.isNaN(planId)) {
            await addCreditPlanPurchaseForUser(userId, planId)
          }
          
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
          // Get subscription plan ID from productId (which is plan-ID)
          const planId = parseInt(productId.replace('plan-', ''))

          // Create or update subscription record
          await sql`
            INSERT INTO user_subscriptions (user_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end)
            VALUES (
              ${userId},
              ${planId},
              ${session.subscription as string},
              'active',
              to_timestamp(${session.created}),
              to_timestamp(${session.created}) + INTERVAL '1 month'
            )
            ON CONFLICT (stripe_subscription_id) DO UPDATE SET
              status = 'active',
              current_period_start = EXCLUDED.current_period_start,
              current_period_end = EXCLUDED.current_period_end,
              updated_at = CURRENT_TIMESTAMP
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
          // For subscriptions, payment_intent might be null if it's the first invoice
          // We can use the subscription ID or find the latest invoice
          let paymentIntentId = session.payment_intent as string
          if (!paymentIntentId && session.subscription) {
            const sub = await stripe.subscriptions.retrieve(session.subscription as string)
            const invoice = await stripe.invoices.retrieve(sub.latest_invoice as string)
            paymentIntentId = invoice.payment_intent as string
          }

          await sql`
            INSERT INTO transactions (user_id, stripe_payment_id, amount_cents, transaction_type, status)
            VALUES (${userId}, ${paymentIntentId}, ${session.amount_total}, 'subscription', 'completed')
          `
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        await sql`
          UPDATE user_subscriptions
          SET status = ${subscription.status},
              current_period_start = to_timestamp(${subscription.current_period_start}),
              current_period_end = to_timestamp(${subscription.current_period_end}),
              updated_at = CURRENT_TIMESTAMP
          WHERE stripe_subscription_id = ${subscription.id}
        `
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        await sql`
          UPDATE user_subscriptions
          SET status = 'canceled',
              updated_at = CURRENT_TIMESTAMP
          WHERE stripe_subscription_id = ${subscription.id}
        `
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
          // This is a recurring payment, record it
          const sub = await sql`
            SELECT user_id FROM user_subscriptions WHERE stripe_subscription_id = ${invoice.subscription as string}
          `
          if (sub.length > 0) {
            const userId = sub[0].user_id
            await sql`
              INSERT INTO transactions (user_id, stripe_payment_id, amount_cents, transaction_type, status)
              VALUES (${userId}, ${invoice.payment_intent as string}, ${invoice.amount_paid}, 'subscription', 'completed')
            `
            
            // Also might want to top up credits for the new month
            // But usually that's handled by a separate logic or we can do it here if we know the plan
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
