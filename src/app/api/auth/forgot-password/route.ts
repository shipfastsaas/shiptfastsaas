import { NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    await dbConnect()

    // Trouver l'utilisateur
    const user = await User.findOne({ email })
    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours un succès même si l'email n'existe pas
      return NextResponse.json({ message: 'If your email exists, you will receive a reset link.' })
    }

    // Générer un token unique
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 heure

    // Hasher le token avant de le stocker
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Sauvegarder le token dans la base de données
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()

    // Créer le lien de réinitialisation
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`

    // Envoyer l'email
    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `
        <div>
          <h1>Reset your password</h1>
          <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ message: 'If your email exists, you will receive a reset link.' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
