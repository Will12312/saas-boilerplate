import { stripe, STRIPE_PLANS, StripePlan } from './stripe'
import { createServerSupabaseClient } from './supabase'

export class SubscriptionService {
  /**
   * Créer un Customer Stripe et l'associer à l'utilisateur
   */
  static async createCustomer(userId: string, email: string, name?: string) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId }
    })

    // Sauvegarder l'ID customer dans Supabase
    const supabase = await createServerSupabaseClient()
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customer.id,
        status: 'inactive'
      })

    return customer
  }

  /**
   * Créer une session de checkout pour s'abonner
   */
  static async createCheckoutSession(userId: string, plan: StripePlan) {
    const supabase = await createServerSupabaseClient()

    // Récupérer ou créer le customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      // Récupérer l'email de l'utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .single()

      if (!profile) throw new Error('User not found')

      const customer = await this.createCustomer(userId, profile.email, profile.full_name)
      customerId = customer.id
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: STRIPE_PLANS[plan].priceId,
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: { userId, plan }
    })

    return session
  }

  /**
   * Créer un portail de facturation pour gérer l'abonnement
   */
  static async createBillingPortal(userId: string) {
    const supabase = await createServerSupabaseClient()

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (!subscription?.stripe_customer_id) {
      throw new Error('No customer found')
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
    })

    return portalSession
  }
}