import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard/DashboardContent'

export const metadata = {
  title: 'Dashboard',
  description: 'Tableau de bord de votre compte'
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Récupérer l'abonnement si il existe
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <DashboardContent 
      user={user} 
      profile={profile} 
      subscription={subscription} 
    />
  )
}