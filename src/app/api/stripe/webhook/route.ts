import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  console.log('🚨 WEBHOOK APPELÉ !')
  
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  console.log('📝 Signature reçue:', signature ? 'OUI' : 'NON')

  if (!signature) {
    console.error('Pas de signature Stripe')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Erreur signature webhook:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Webhook reçu:', event.type)

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        console.log('Paiement réussi pour:', invoice.customer)
        break

      default:
        console.log('Événement ignoré:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erreur traitement webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Gérer création/mise à jour d'abonnement
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  console.log('🔄 Mise à jour abonnement:', subscription.id)
  
  const supabase = await createServerSupabaseClient()
  
  const customerId = subscription.customer as string
  const subscriptionId = subscription.id
  const status = subscription.status
  const priceId = subscription.items.data[0]?.price?.id
  
  // Les propriétés existent mais ne sont pas dans les types, on les force
  const subscriptionData = subscription as Stripe.Subscription & {
    current_period_start: number
    current_period_end: number
  }
  
  const currentPeriodStart = new Date(subscriptionData.current_period_start * 1000).toISOString()
  const currentPeriodEnd = new Date(subscriptionData.current_period_end * 1000).toISOString()

  // Mettre à jour l'abonnement
  const { error } = await supabase
    .from('subscriptions')
    .update({
      stripe_subscription_id: subscriptionId,
      status,
      price_id: priceId,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Erreur mise à jour abonnement:', error)
  } else {
    console.log('✅ Abonnement mis à jour:', customerId)
  }
}

// Gérer suppression d'abonnement
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = await createServerSupabaseClient()
  const customerId = subscription.customer as string

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      stripe_subscription_id: null,
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Erreur annulation abonnement:', error)
  } else {
    console.log('Abonnement annulé:', customerId)
  }
}