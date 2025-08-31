import { NextRequest, NextResponse } from 'next/server'
import { SubscriptionService } from '@/lib/subscription-service'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const portalSession = await SubscriptionService.createBillingPortal(user.id)

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Erreur portal:', error)
    return NextResponse.json(
      { error: 'Erreur création portal' },
      { status: 500 }
    )
  }
}