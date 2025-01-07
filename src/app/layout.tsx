import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/analytics/google-tag-manager'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShipFast - Ship your SaaS fast',
  description: 'Ship your SaaS project faster with our starter kit',
  icons: {
    icon: '/favicon.png',
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
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
