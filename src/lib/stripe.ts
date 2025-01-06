import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const PRICE_ID = process.env.STRIPE_PRICE_ID!
export const SUCCESS_URL = `${process.env.NEXT_PUBLIC_APP_URL}/thank-you`
export const CANCEL_URL = `${process.env.NEXT_PUBLIC_APP_URL}/pricing`
