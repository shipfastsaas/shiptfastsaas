import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Validation basique
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    await dbConnect()

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    // Créer le nouvel utilisateur
    const user = new User({
      name,
      email,
      password, // Le mot de passe sera hashé automatiquement grâce au middleware dans le modèle User
    })

    await user.save()

    // Envoyer l'email de bienvenue
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to ShipFast!',
        html: `
          <h2>Welcome to ShipFast, ${name}!</h2>
          <p>We're excited to have you on board. Your account has been successfully created.</p>
          <p>You can now log in and start using our services:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">
            Log in to your account
          </a>
          <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
        `,
      })
    } catch (error) {
      console.error('Failed to send welcome email:', error)
      // On continue même si l'email échoue
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
