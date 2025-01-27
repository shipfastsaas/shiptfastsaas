import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await sendEmail({
      to: email,
      subject: 'Test Email from ShipFast',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from your ShipFast application.</p>
        <p>If you received this email, your email configuration is working correctly!</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">
          Visit ShipFast
        </a>
      `,
    })

    return NextResponse.json({ message: 'Test email sent successfully' })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
