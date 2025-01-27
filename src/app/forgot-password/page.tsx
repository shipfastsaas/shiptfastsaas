import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute top-0 -left-4 w-72 h-72 gradient-background-30 rounded-full filter blur-3xl opacity-70 animate-pulse" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-orange/30 rounded-full filter blur-3xl opacity-70 animate-pulse delay-75" />
        <div className="absolute -z-10 inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative w-full px-6 py-12 mx-auto max-w-7xl lg:px-8 lg:py-16 flex justify-center">
        <ForgotPasswordForm />
      </div>
    </section>
  )
}
