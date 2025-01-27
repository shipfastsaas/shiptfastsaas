import { NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Fetching payments from Stripe...')

    // Récupérer les paiements
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.payment_method', 'data.customer'],
    })

    console.log(`Found ${paymentIntents.data.length} payments`)

    // Formater les données pour l'affichage
    const formattedPayments = paymentIntents.data.map((payment) => {
      const customer = payment.customer as Stripe.Customer
      return {
        id: payment.id,
        amount: payment.amount / 100, // Convertir les centimes en euros
        currency: payment.currency,
        status: payment.status,
        created: payment.created,
        paymentMethod: payment.payment_method_types[0],
        customerEmail: customer?.email || payment.receipt_email || null,
      }
    })

    return NextResponse.json(formattedPayments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
