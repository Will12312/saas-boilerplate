import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

// Client Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
})

// Configuration des plans (tu peux les modifier)
export const STRIPE_PLANS = {
  BASIC: {
    name: 'Plan Basic',
    price: 9, // 9€/mois
    priceId: 'price_1S2DSEEaSevGl4uieBNjfBS8', // Tu créeras ce prix dans Stripe
    features: [
      'Accès aux fonctionnalités de base',
      'Support email',
      '5 projets maximum'
    ]
  },
  PRO: {
    name: 'Plan Pro',
    price: 29, // 29€/mois
    priceId: 'price_1S2DSXEaSevGl4uiCvBFTSRg', // Tu créeras ce prix dans Stripe
    features: [
      'Toutes les fonctionnalités Basic',
      'Support prioritaire',
      'Projets illimités',
      'Analytics avancées'
    ]
  }
} as const

export type StripePlan = keyof typeof STRIPE_PLANS