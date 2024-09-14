'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/components/icons/Logo.png'
import { useRouter } from 'next/navigation'
import { sendPasswordRecoveryEmail } from '@/app/appwrite/Services/authServices' // Import the Appwrite service

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false) // Loading state
  const [error, setError] = useState('') // Error message
  const [success, setSuccess] = useState('') // Success message
  const router = useRouter()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      // Call the Appwrite function to send password recovery email
      await sendPasswordRecoveryEmail(email)

      // If successful, set success message and optionally redirect
      setSuccess('Password reset link sent to your email')
      
      // Redirect to confirmation page after a delay
      setTimeout(() => {
        router.push('/forgot-password-confirmation')
      }, 2000)
    } catch (error) {
      setError('There was an issue sending the reset link. Please try again.')
      console.error('Password reset error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 z-0 bg-white bg-opacity-70">
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
      </div>
      <Image src={Logo} alt="Your Logo" className="mx-auto h-[10rem] w-auto z-10" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading} // Disable input when loading
                />
              </div>
            </div>

            {/* Show error message if any */}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Show success message if password reset is successful */}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <div>
              <Button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Remember your password?
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
