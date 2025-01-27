'use client'

import { useState } from 'react'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to send reset email')
      }

      setStatus('success')
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Check your email</span>
          </h2>
          <p className="mt-2 text-text-secondary">
            We&apos;ve sent a password reset link to {email}
          </p>
        </div>
        <div className="text-center text-sm text-text-secondary">
          <Link href="/login" className="font-medium text-primary-rose hover:text-primary-rose/80">
            Return to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Forgot password?</span>
        </h2>
        <p className="mt-2 text-text-secondary">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-background text-text-primary shadow-sm focus:border-primary-rose focus:ring-primary-rose"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full gradient-background px-8 py-4 text-white font-medium shadow-lg shadow-primary-rose/25 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Reset password'}
          </button>
        </div>

        <div className="text-center text-sm text-text-secondary">
          Remember your password?{' '}
          <Link href="/login" className="font-medium text-primary-rose hover:text-primary-rose/80">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  )
}
