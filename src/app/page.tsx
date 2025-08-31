import { createServerSupabaseClient } from '@/lib/supabase'

export default async function Home() {
  const supabase = await createServerSupabaseClient()
  
  // Test simple : vérifier que Supabase répond
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Mon SaaS Boilerplate</h1>
      
      {/* Test de connexion Supabase */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">Test Supabase :</h2>
        {error ? (
          <p className="text-red-600">❌ Erreur : {error.message}</p>
        ) : (
          <p className="text-green-600">✅ Connexion réussie !</p>
        )}
      </div>
    </main>
  )
}