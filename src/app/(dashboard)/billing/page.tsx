export const metadata = {
  title: 'Facturation',
  description: 'Gérez votre abonnement et facturation'
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Facturation</h1>
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-600">Gestion de la facturation à venir...</p>
      </div>
    </div>
  )
}