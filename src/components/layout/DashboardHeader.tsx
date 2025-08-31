'use client'

import { User } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Mon SaaS</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user.email}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSignOut}
          >
            Se déconnecter
          </Button>
        </div>
      </div>
    </header>
  )
}