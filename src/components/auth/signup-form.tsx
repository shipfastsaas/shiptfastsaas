'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SocialLoginButtons } from './social-login-buttons'

export function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStatus('loading')

    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setStatus('error')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      setStatus('error')
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      setStatus('success')
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (status === 'success') {
    return (
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Welcome aboard!</span>
          </h2>
          <p className="mt-2 text-text-secondary">
            Your account has been created successfully. Redirecting you to login...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Create your account</span>
        </h2>
        <p className="mt-2 text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-rose hover:text-primary-rose/80">
            Sign in
          </Link>
        </p>
      </div>

      <SocialLoginButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-text-secondary">Or continue with</span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary">
              Full name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-background text-text-primary shadow-sm focus:border-primary-rose focus:ring-primary-rose"
                placeholder="John Doe"
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-background text-text-primary shadow-sm focus:border-primary-rose focus:ring-primary-rose"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-background text-text-primary shadow-sm focus:border-primary-rose focus:ring-primary-rose"
                placeholder="••••••••"
                minLength={8}
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
              Confirm password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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
            {status === 'loading' ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p className="text-center text-sm text-text-secondary">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="font-medium text-primary-rose hover:text-primary-rose/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-medium text-primary-rose hover:text-primary-rose/80">
            Privacy Policy
          </Link>
        </p>
      </form>
    </div>
  )
}
