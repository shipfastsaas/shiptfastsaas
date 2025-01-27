import { NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    await dbConnect()

    // Hasher le token reçu pour le comparer avec celui stocké
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Trouver l'utilisateur avec le token valide et non expiré
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Mettre à jour le mot de passe et supprimer le token de réinitialisation
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return NextResponse.json({ message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}
