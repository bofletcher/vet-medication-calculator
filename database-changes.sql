-- =====================================================
-- DATABASE CHANGES - VETERINARY MEDICATION CALCULATOR
-- =====================================================
-- 
-- This file tracks all database schema changes after the initial setup.
-- Run these changes in your Supabase SQL Editor when you need them.
--
-- Initial schema: supabase-schema.sql (run once)
-- Future changes: Add them here with dates and descriptions
-- =====================================================

-- =====================================================
-- CHANGE LOG
-- =====================================================
-- 2024-01-15: Initial schema created (supabase-schema.sql)
-- [Future changes will be added below with dates]
-- =====================================================

-- =====================================================
-- FUTURE CHANGES - ADD BELOW THIS LINE
-- =====================================================

-- Example: Adding contraindications feature
-- Date: [Add date when you implement this]
-- Description: Add contraindications and pregnancy safety info to medications
/*
ALTER TABLE medications ADD COLUMN IF NOT EXISTS contraindications TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pregnancy_safe BOOLEAN DEFAULT false;

-- Add comment to explain the new fields
COMMENT ON COLUMN medications.contraindications IS 'Known contraindications for this medication';
COMMENT ON COLUMN medications.pregnancy_safe IS 'Whether this medication is safe during pregnancy';
*/

-- Example: Adding drug interactions table
-- Date: [Add date when you implement this]
-- Description: Track potential drug interactions between medications
/*
CREATE TABLE IF NOT EXISTS drug_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  interaction_with TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high')) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE drug_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view drug interactions" ON drug_interactions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Add index for performance
CREATE INDEX idx_drug_interactions_medication_id ON drug_interactions(medication_id);
*/

-- Example: Adding medication images
-- Date: [Add date when you implement this]
-- Description: Store medication images and pill identifiers
/*
ALTER TABLE medications ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE medications ADD COLUMN IF NOT EXISTS pill_identifier TEXT;

-- Add comment
COMMENT ON COLUMN medications.image_url IS 'URL to medication image';
COMMENT ON COLUMN medications.pill_identifier IS 'Pill description (color, shape, markings)';
*/

-- Example: Adding dosage history tracking
-- Date: [Add date when you implement this]
-- Description: Track when dosages were calculated for audit purposes
/*
CREATE TABLE IF NOT EXISTS dosage_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  animal_weight_kg DECIMAL(5,2) NOT NULL,
  calculated_dosage_mg DECIMAL(8,3) NOT NULL,
  species TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policy
ALTER TABLE dosage_calculations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own dosage calculations" ON dosage_calculations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dosage calculations" ON dosage_calculations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_dosage_calculations_user_id ON dosage_calculations(user_id);
CREATE INDEX idx_dosage_calculations_medication_id ON dosage_calculations(medication_id);
CREATE INDEX idx_dosage_calculations_created_at ON dosage_calculations(created_at);
*/

-- Example: Adding clinic/practice management
-- Date: [Add date when you implement this]
-- Description: Support for multiple clinics and practice management
/*
-- Add clinic table
CREATE TABLE IF NOT EXISTS clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link users to clinics
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);

-- Add RLS policy for clinics
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view clinics they belong to" ON clinics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.clinic_id = clinics.id 
      AND user_profiles.user_id = auth.uid()
    )
  );
*/

-- =====================================================
-- HOW TO USE THIS FILE
-- =====================================================
--
-- 1. When you want to add a new feature:
--    - Uncomment the relevant section above
--    - Add the current date
--    - Customize the SQL for your needs
--    - Run it in Supabase SQL Editor
--
-- 2. After running changes:
--    - Update your TypeScript types in src/lib/supabase.ts
--    - Update your components to use new fields
--    - Test everything works
--
-- 3. Keep this file in version control:
--    - Track all database evolution
--    - Easy for team members to see changes
--    - Simple deployment process
--
-- =====================================================
-- TIPS FOR DATABASE CHANGES
-- =====================================================
--
-- ✅ Always backup important data before changes
-- ✅ Test changes locally first
-- ✅ Use IF NOT EXISTS to avoid errors on re-runs
-- ✅ Add proper RLS policies for new tables
-- ✅ Create indexes for performance
-- ✅ Add comments to explain new fields
-- ✅ Update TypeScript types after changes
-- ✅ Test your app still works after changes
--
-- =====================================================
