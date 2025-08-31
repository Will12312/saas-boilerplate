import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { DashboardHeader } from '@/components/layout/DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <div className="flex">
        <DashboardNav />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}