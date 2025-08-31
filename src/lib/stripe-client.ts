import { loadStripe } from '@stripe/stripe-js'

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is required')
}

// Initialisation Stripe côté client (singleton)
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)