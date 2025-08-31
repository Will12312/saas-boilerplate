'use client'

import { STRIPE_PLANS, StripePlan } from '@/lib/stripe'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PricingCardProps {
  planKey: StripePlan
  plan: typeof STRIPE_PLANS[StripePlan]
  popular?: boolean
}

export function PricingCard({ planKey, plan, popular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubscribe = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey })
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur lors de la création du checkout')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 relative ${
      popular ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'
    }`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Plus populaire
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-gray-900 mb-1">
          {plan.price}€
          <span className="text-lg font-normal text-gray-600">/mois</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          popular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Chargement...' : 'S\'abonner'}
      </button>
    </div>
  )
}