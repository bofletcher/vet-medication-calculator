-- Veterinary Medication Calculator Database Schema
-- Run this in your Supabase SQL Editor

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  clinic_name TEXT,
  license_number TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  species TEXT CHECK (species IN ('dog', 'cat', 'both')) NOT NULL DEFAULT 'both',
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create dosage guidelines table
CREATE TABLE IF NOT EXISTS dosage_guidelines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  min_weight_kg DECIMAL(5,2) NOT NULL,
  max_weight_kg DECIMAL(5,2) NOT NULL,
  dosage_mg_per_kg DECIMAL(8,3) NOT NULL,
  frequency_per_day INTEGER NOT NULL DEFAULT 1,
  duration_days INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (min_weight_kg <= max_weight_kg),
  CHECK (min_weight_kg > 0),
  CHECK (dosage_mg_per_kg > 0),
  CHECK (frequency_per_day > 0)
);

-- Create user favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, medication_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_species ON medications(species);
CREATE INDEX IF NOT EXISTS idx_medications_category ON medications(category);
CREATE INDEX IF NOT EXISTS idx_dosage_guidelines_medication_id ON dosage_guidelines(medication_id);
CREATE INDEX IF NOT EXISTS idx_dosage_guidelines_weight_range ON dosage_guidelines(min_weight_kg, max_weight_kg);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_medication_id ON user_favorites(medication_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dosage_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Medications: All authenticated users can read medications
CREATE POLICY "Authenticated users can view medications" ON medications
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert medications" ON medications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update medications" ON medications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Dosage Guidelines: All authenticated users can read dosage guidelines
CREATE POLICY "Authenticated users can view dosage guidelines" ON dosage_guidelines
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert dosage guidelines" ON dosage_guidelines
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update dosage guidelines" ON dosage_guidelines
  FOR UPDATE USING (auth.role() = 'authenticated');

-- User Favorites: Users can only access their own favorites
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample medications
INSERT INTO medications (name, generic_name, species, category, description) VALUES
('Rimadyl', 'Carprofen', 'both', 'NSAID', 'Non-steroidal anti-inflammatory drug for pain and inflammation'),
('Metacam', 'Meloxicam', 'both', 'NSAID', 'NSAID for osteoarthritis and post-operative pain'),
('Tramadol', 'Tramadol HCl', 'both', 'Analgesic', 'Opioid-like analgesic for moderate to severe pain'),
('Gabapentin', 'Gabapentin', 'both', 'Anticonvulsant', 'Used for neuropathic pain and seizures'),
('Prednisone', 'Prednisone', 'both', 'Corticosteroid', 'Anti-inflammatory steroid medication'),
('Amoxicillin', 'Amoxicillin', 'both', 'Antibiotic', 'Broad-spectrum penicillin antibiotic'),
('Clavamox', 'Amoxicillin/Clavulanate', 'both', 'Antibiotic', 'Antibiotic combination for bacterial infections'),
('Cerenia', 'Maropitant', 'both', 'Antiemetic', 'Prevents vomiting and motion sickness')
ON CONFLICT DO NOTHING;

-- Insert sample dosage guidelines
INSERT INTO dosage_guidelines (medication_id, min_weight_kg, max_weight_kg, dosage_mg_per_kg, frequency_per_day, duration_days, notes)
SELECT 
  m.id,
  1.0, 10.0, 4.4, 1, 7, 'Small dogs and cats - once daily with food'
FROM medications m WHERE m.name = 'Rimadyl'
UNION ALL
SELECT 
  m.id,
  10.1, 30.0, 4.4, 1, 7, 'Medium dogs - once daily with food'
FROM medications m WHERE m.name = 'Rimadyl'
UNION ALL
SELECT 
  m.id,
  30.1, 70.0, 4.4, 1, 7, 'Large dogs - once daily with food'
FROM medications m WHERE m.name = 'Rimadyl'
UNION ALL
SELECT 
  m.id,
  1.0, 5.0, 0.1, 1, 3, 'Cats and small dogs - once daily'
FROM medications m WHERE m.name = 'Metacam'
UNION ALL
SELECT 
  m.id,
  5.1, 50.0, 0.1, 1, 3, 'Dogs - once daily'
FROM medications m WHERE m.name = 'Metacam'
ON CONFLICT DO NOTHING;
