import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics/google-tag-manager'
import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShipFast - The Ultimate NextJS SaaS Starter Kit',
  description: 'Launch your SaaS faster with our premium Next.js boilerplate. Complete starter kit with authentication, payments, and marketing pages. The perfect Next.js template for your SaaS project.',
  keywords: 'nextjs starter kit, next.js boilerplate, saas template, next.js saas kit, react starter, typescript template, saas boilerplate, next.js 13, next.js 14',
  openGraph: {
    title: 'ShipFast - The Ultimate NextJS SaaS Starter Kit',
    description: 'Launch your SaaS faster with our premium Next.js boilerplate. Complete starter kit with authentication, payments, and marketing pages.',
    url: 'https://shipfast.dev',
    siteName: 'ShipFast',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShipFast - The Ultimate NextJS SaaS Starter Kit',
    description: 'Launch your SaaS faster with our premium Next.js boilerplate',
    creator: '@shipfast',
  },
  icons: {
    icon: '/favicon.png',
  },
  verification: {
    google: 'Hkriyba_PuUuOE7hQpLEIovnsPyfxTBfA73G1xvHs3U',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <GoogleAnalytics />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GoogleTagManagerNoScript />
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <CookieConsent />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
