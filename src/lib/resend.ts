import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: 'Mon SaaS <onboarding@resend.dev>', // Utilise le domaine gratuit de Resend
      to: email,
      subject: '🎉 Bienvenue dans Mon SaaS !',
      html: `
        <h2>Salut ${name} !</h2>
        <p>Bienvenue dans Mon SaaS ! Votre compte est prêt.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accéder à mon dashboard</a></p>
        <p>L'équipe Mon SaaS</p>
      `
    })
    console.log('📧 Email envoyé à', email)
  } catch (error) {
    console.error('❌ Erreur email:', error)
  }
}