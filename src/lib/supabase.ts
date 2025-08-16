import { createClient } from '@supabase/supabase-js'

// Create a function to get the Supabase client
// This ensures it only runs on the client side
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
    console.error('Please check your .env.local file and ensure all required variables are set.')
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Export a function that returns the client, not the client itself
export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side rendering - return null
    return null
  }
  return createSupabaseClient()
}

// For components that need the client, they should use getSupabaseClient()
// or handle the null case appropriately

// Types for our database tables
export interface Medication {
  id: string
  name: string
  generic_name?: string
  species: 'dog' | 'cat' | 'both'
  category: string
  description?: string
  created_at: string
  updated_at: string
}

export interface DosageGuideline {
  id: string
  medication_id: string
  min_weight_kg: number
  max_weight_kg: number
  dosage_mg_per_kg: number
  frequency_per_day: number
  duration_days?: number
  notes?: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  clinic_name?: string
  license_number?: string
  preferences: {
    default_species?: 'dog' | 'cat'
    weight_unit?: 'kg' | 'lbs'
  }
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  medication_id: string
  created_at: string
}

// Database type for joins
export interface MedicationWithDosage extends Medication {
  dosage_guidelines: DosageGuideline[]
}

export interface FavoriteMedication extends Medication {
  user_favorites: { created_at: string }[]
}
