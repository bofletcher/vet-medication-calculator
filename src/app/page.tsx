import { MedicationCalculator } from '@/components/medication-calculator'
import { EnvError } from '@/components/env-error'

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
        <MedicationCalculator />
      </div>
    </div>
  );
}
