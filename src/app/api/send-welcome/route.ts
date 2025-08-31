import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const { email, name } = await req.json()
  
  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 })
  }

  try {
    await sendWelcomeEmail(email, name || 'Utilisateur')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur envoi' }, { status: 500 })
  }
}