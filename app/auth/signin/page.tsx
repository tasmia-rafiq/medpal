'use client'

import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FileText, Chrome, Loader2 } from 'lucide-react'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
    })
  }, [router, callbackUrl])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Sign in error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-10 w-10 text-secondary" />
            <span className="text-3xl font-bold text-primary">MedPal</span>
          </div>
          <h1 className="text-2xl font-bold text-black-200 mb-2">
            Welcome Back
          </h1>
          <p className="text-black-300">
            Sign in to access your medical reports dashboard
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-200 text-black-200 py-3 px-4 rounded-lg hover:border-secondary hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 text-red-500" />
            )}
            <span className="font-medium">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          <div className="text-center">
            <p className="text-sm text-black-300">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-black-200 mb-3">
              Why sign in?
            </h3>
            <ul className="text-xs text-black-300 space-y-1">
              <li>• Save and organize your medical reports</li>
              <li>• Access your reports from any device</li>
              <li>• Secure cloud storage for your health data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}