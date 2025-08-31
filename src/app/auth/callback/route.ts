// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/dashboard'

  if (!code) {
    return NextResponse.redirect(`${url.origin}/login?error=missing_code`)
  }

  // NOTE: Next 15 => cookies() est async
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          // signature Next 15: set(name, value, options)
          cookieStore.set(name, value, options)
        },
        remove(name, options) {
          // delete est dispo sur RequestCookies
          cookieStore.delete?.(name)
          // fallback au besoin:
          // cookieStore.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('exchangeCodeForSession error:', error)
    return NextResponse.redirect(`${url.origin}/login?error=exchange_failed`)
  }

  return NextResponse.redirect(`${url.origin}${next}`)
}
