'use client'

import { useState, useEffect } from 'react'
import { MedicationCalculator } from '@/components/medication-calculator'
import { EnvError } from '@/components/env-error'
import { AuthButton } from '@/components/auth-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, Calculator, Shield, UserPlus } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

export default function Home() {
  const [user, setUser] = useState<{ id: string; email: string | undefined } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <EnvError />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <Calculator className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Veterinary Medication Calculator
            </h1>
            <p className="text-xl text-gray-600">
              Professional dosage calculations for veterinary professionals
            </p>
          </div>

          {/* Login Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Sign In to Access Calculator
                </h2>
                <p className="text-gray-600">
                  This tool is for licensed veterinary professionals only
                </p>
              </div>

              <div className="space-y-4">
                <Link href="/signin" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <User className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                
                <Link href="/signin" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">What you&apos;ll get:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Personalized medication favorites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-blue-600" />
                    <span>Save calculation history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-purple-600" />
                    <span>Add custom medications</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Link */}
            <div className="text-center mt-6">
              <Link 
                href="/instructions" 
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                📖 View Instructions
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If user is authenticated, show the full calculator
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Veterinary Medication Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate precise medication dosages for dogs and cats based on weight
          </p>
        </div>

        {/* Header with Auth and Instructions */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            <Link href="/instructions" className="text-blue-600 hover:text-blue-800 underline">
              📖 View Instructions
            </Link>
          </div>
          <AuthButton />
        </div>

        <MedicationCalculator />
      </div>
    </div>
  )
}
