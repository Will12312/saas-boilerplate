import { STRIPE_PLANS } from '@/lib/stripe'
import { PricingCard } from '@/components/pricing/PricingCard'

export const metadata = {
  title: 'Tarifs',
  description: 'Choisissez le plan qui vous convient'
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-600">
            Des tarifs simples et transparents pour faire grandir votre business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(STRIPE_PLANS).map(([key, plan]) => (
            <PricingCard
              key={key}
              planKey={key as keyof typeof STRIPE_PLANS}
              plan={plan}
              popular={key === 'PRO'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}