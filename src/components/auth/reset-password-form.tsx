'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }

      setStatus('success')
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError('Failed to reset password. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Password reset successful!</span>
          </h2>
          <p className="mt-2 text-text-secondary">
            Your password has been reset. Redirecting you to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Reset password</span>
        </h2>
        <p className="mt-2 text-text-secondary">
          Enter your new password below
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              New password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-background text-text-primary shadow-sm focus:border-primary-rose focus:ring-primary-rose"
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary">
              Confirm new password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-background text-text-primary shadow-sm focus:border-primary-rose focus:ring-primary-rose"
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full gradient-background px-8 py-4 text-white font-medium shadow-lg shadow-primary-rose/25 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Resetting...' : 'Reset password'}
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
