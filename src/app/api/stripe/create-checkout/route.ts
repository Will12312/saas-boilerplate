import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/lib/subscription-service'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json()

    // Vérifier que l'utilisateur est connecté
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Créer la session de checkout
    const session = await SubscriptionService.createCheckoutSession(user.id, plan)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erreur checkout:', error)
    return NextResponse.json(
      { error: 'Erreur création checkout' },
      { status: 500 }
    )
  }
}