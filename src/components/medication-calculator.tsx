'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Calculator, Dog, Cat } from 'lucide-react'
import { getSupabaseClient, type DosageGuideline, type MedicationWithDosage } from '@/lib/supabase'
import { AddMedicationDialog } from '@/components/add-medication-dialog'
import { AuthButton } from '@/components/auth-button'

export function MedicationCalculator() {
  const [medications, setMedications] = useState<MedicationWithDosage[]>([])
  const [selectedMedication, setSelectedMedication] = useState<MedicationWithDosage | null>(null)
  const [animalWeight, setAnimalWeight] = useState<string>('')
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [species, setSpecies] = useState<'dog' | 'cat' | 'both'>('both')
  const [dosageResult, setDosageResult] = useState<{
    dosage: number
    frequency: number
    duration?: number
    notes?: string
  } | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  // Convert weight to kg if needed
  const getWeightInKg = (weight: string, unit: 'kg' | 'lbs'): number => {
    const weightNum = parseFloat(weight)
    return unit === 'lbs' ? weightNum * 0.453592 : weightNum
  }

  // Load medications and user data
  useEffect(() => {
    const loadData = async () => {
      await loadMedications()
      await loadUserData()
    }
    loadData()
  }, [species])

  const loadUserData = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      loadFavorites(user.id)
    }
  }

  const loadMedications = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    
    setLoading(true)
    try {
      let query = supabase
        .from('medications')
        .select(`
          *,
          dosage_guidelines(*)
        `)
      
      if (species !== 'both') {
        query = query.or(`species.eq.${species},species.eq.both`)
      }

      const { data, error } = await query.order('name')
      
      if (error) throw error
      setMedications(data || [])
    } catch (error) {
      console.error('Error loading medications:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async (userId: string) => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('medication_id')
        .eq('user_id', userId)
      
      if (error) throw error
      setFavorites(new Set(data?.map(f => f.medication_id) || []))
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const toggleFavorite = async (medicationId: string) => {
    if (!user) return

    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      if (favorites.has(medicationId)) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('medication_id', medicationId)
        
        setFavorites(prev => {
          const newSet = new Set(prev)
          newSet.delete(medicationId)
          return newSet
        })
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            medication_id: medicationId
          })
        
        setFavorites(prev => new Set([...prev, medicationId]))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const calculateDosage = () => {
    if (!selectedMedication || !animalWeight) {
      setDosageResult(null)
      return
    }

    const weightKg = getWeightInKg(animalWeight, weightUnit)
    
    // Find appropriate dosage guideline based on weight
    const guideline = selectedMedication.dosage_guidelines.find(
      (g: DosageGuideline) => weightKg >= g.min_weight_kg && weightKg <= g.max_weight_kg
    )

    if (!guideline) {
      setDosageResult(null)
      return
    }

    const totalDosage = weightKg * guideline.dosage_mg_per_kg

    setDosageResult({
      dosage: totalDosage,
      frequency: guideline.frequency_per_day,
      duration: guideline.duration_days,
      notes: guideline.notes
    })
  }

  const favoriteMedications = medications.filter(med => favorites.has(med.id))
  const allMedications = medications

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Auth */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={species} onValueChange={(value: 'dog' | 'cat' | 'both') => setSpecies(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">
                <div className="flex items-center gap-2">
                  <Dog className="h-4 w-4" />
                  <Cat className="h-4 w-4" />
                  Both
                </div>
              </SelectItem>
              <SelectItem value="dog">
                <div className="flex items-center gap-2">
                  <Dog className="h-4 w-4" />
                  Dogs
                </div>
              </SelectItem>
              <SelectItem value="cat">
                <div className="flex items-center gap-2">
                  <Cat className="h-4 w-4" />
                  Cats
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AuthButton />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Panel - Medication Selection */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Medications</TabsTrigger>
              <TabsTrigger value="favorites" disabled={!user}>
                <Heart className="h-4 w-4 mr-2" />
                Favorites ({favorites.size})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-2 max-h-96 overflow-y-auto">
              {allMedications.map((medication) => (
                <Card 
                  key={medication.id}
                  className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMedication?.id === medication.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedMedication(medication)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{medication.name}</h3>
                        {medication.generic_name && (
                          <p className="text-sm text-gray-600">({medication.generic_name})</p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{medication.category}</Badge>
                          <Badge variant="outline">
                            {medication.species === 'both' ? 'Dogs & Cats' : 
                             medication.species === 'dog' ? 'Dogs' : 'Cats'}
                          </Badge>
                        </div>
                      </div>
                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(medication.id)
                          }}
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favorites.has(medication.id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400'
                            }`}
                          />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="favorites" className="space-y-2 max-h-96 overflow-y-auto">
              {favoriteMedications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No favorite medications yet. Add some by clicking the heart icon!
                </p>
              ) : (
                favoriteMedications.map((medication) => (
                  <Card 
                    key={medication.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedMedication?.id === medication.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedMedication(medication)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{medication.name}</h3>
                          {medication.generic_name && (
                            <p className="text-sm text-gray-600">({medication.generic_name})</p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{medication.category}</Badge>
                            <Badge variant="outline">
                              {medication.species === 'both' ? 'Dogs & Cats' : 
                               medication.species === 'dog' ? 'Dogs' : 'Cats'}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(medication.id)
                          }}
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
          
          {user && <AddMedicationDialog onMedicationAdded={loadMedications} />}
        </div>

        {/* Right Panel - Calculator */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Dosage Calculator
              </CardTitle>
              <CardDescription>
                Enter animal weight to calculate precise medication dosage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Animal Weight</Label>
                <div className="flex gap-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={animalWeight}
                    onChange={(e) => setAnimalWeight(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lbs">lbs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={calculateDosage} 
                className="w-full"
                disabled={!selectedMedication || !animalWeight}
              >
                Calculate Dosage
              </Button>

              {selectedMedication && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Selected Medication</h3>
                  <p className="text-blue-800">{selectedMedication.name}</p>
                  {selectedMedication.description && (
                    <p className="text-sm text-blue-700 mt-1">{selectedMedication.description}</p>
                  )}
                </div>
              )}

              {dosageResult && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Dosage Calculation</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Total Dosage:</strong> {dosageResult.dosage.toFixed(2)} mg</p>
                    <p><strong>Frequency:</strong> {dosageResult.frequency} time(s) per day</p>
                    {dosageResult.duration && (
                      <p><strong>Duration:</strong> {dosageResult.duration} days</p>
                    )}
                    {dosageResult.notes && (
                      <p><strong>Notes:</strong> {dosageResult.notes}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedMedication && animalWeight && !dosageResult && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    No dosage guideline found for this weight range. Please consult veterinary guidelines or add appropriate dosage information.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
