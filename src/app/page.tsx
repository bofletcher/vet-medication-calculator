import { MedicationCalculator } from '@/components/medication-calculator'
import { EnvError } from '@/components/env-error'
import { AuthButton } from '@/components/auth-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export default function Home() {
  // Check if environment variables are set
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!hasEnvVars) {
    return <EnvError />
  }

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

        {/* Welcome message for unauthenticated users */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to the Veterinary Medication Calculator
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              This professional tool helps veterinarians calculate accurate medication dosages based on animal weight, 
              species, and clinical guidelines. Sign in to access personalized features like favorites, custom medications, 
              and calculation history.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signin">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <User className="h-5 w-5 mr-2" />
                  Sign In to Get Started
                </Button>
              </Link>
              <Link href="/instructions">
                <Button variant="outline" size="lg">
                  📖 View Instructions
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <MedicationCalculator />
      </div>
    </div>
  );
}
