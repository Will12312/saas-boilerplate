'use client'

import { User } from '@supabase/supabase-js'
import { Profile, Subscription } from '@/types/database'

interface DashboardContentProps {
  user: User
  profile: Profile | null
  subscription: Subscription | null
}

export function DashboardContent({ user, profile, subscription }: DashboardContentProps) {
  const sendWelcomeEmail = async () => {
    try {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: profile?.full_name
        })
      })
      alert('Email envoyé ! 📧')
    } catch {
      alert('Erreur envoi email')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {profile?.full_name || 'Utilisateur'} ! 👋
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Profil */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profil</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Nom:</span> {profile?.full_name || 'Non défini'}</p>
            <p><span className="font-medium">Membre depuis:</span> {new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        {/* Carte Abonnement */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonnement</h3>
          <div className="space-y-2">
            {subscription ? (
              <>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.status}
                  </span>
                </p>
                <p><span className="font-medium">Plan:</span> {subscription.price_id || 'Basique'}</p>
              </>
            ) : (
              <div>
                <p className="text-gray-600 mb-3">Aucun abonnement actif</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                  Souscrire à un plan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carte Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibent text-gray-900 mb-4">Actions rapides</h3>
          <div className="space-y-3">
            <button 
              onClick={sendWelcomeEmail}
              className="w-full text-left p-2 rounded-md hover:bg-gray-50 text-sm bg-green-50 text-green-700 border border-green-200"
            >
              📧 Tester email de bienvenue
            </button>
            <button className="w-full text-left p-2 rounded-md hover:bg-gray-50 text-sm">
              ⚙️ Paramètres du compte
            </button>
            <button className="w-full text-left p-2 rounded-md hover:bg-gray-50 text-sm">
              💰 Gérer la facturation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}