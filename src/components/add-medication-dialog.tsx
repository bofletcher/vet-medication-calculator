'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const dosageGuidelineSchema = z.object({
  min_weight_kg: z.number().min(0.1, 'Minimum weight must be greater than 0'),
  max_weight_kg: z.number().min(0.1, 'Maximum weight must be greater than 0'),
  dosage_mg_per_kg: z.number().min(0.001, 'Dosage must be greater than 0'),
  frequency_per_day: z.number().int().min(1, 'Frequency must be at least 1'),
  duration_days: z.number().int().min(1).optional(),
  notes: z.string().optional()
}).refine(data => data.max_weight_kg >= data.min_weight_kg, {
  message: "Maximum weight must be greater than or equal to minimum weight",
  path: ["max_weight_kg"]
})

const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  generic_name: z.string().optional(),
  species: z.enum(['dog', 'cat', 'both']),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  dosage_guidelines: z.array(dosageGuidelineSchema).min(1, 'At least one dosage guideline is required')
})

type MedicationForm = z.infer<typeof medicationSchema>

interface AddMedicationDialogProps {
  onMedicationAdded: () => void
}

export function AddMedicationDialog({ onMedicationAdded }: AddMedicationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<MedicationForm>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      species: 'both',
      dosage_guidelines: [{
        min_weight_kg: 1,
        max_weight_kg: 10,
        dosage_mg_per_kg: 1,
        frequency_per_day: 1,
        duration_days: 7,
        notes: ''
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dosage_guidelines'
  })

  const onSubmit = async (data: MedicationForm) => {
    const supabase = getSupabaseClient()
    if (!supabase) return

    setLoading(true)
    try {
      // Insert medication
      const { data: medication, error: medicationError } = await supabase
        .from('medications')
        .insert({
          name: data.name,
          generic_name: data.generic_name || null,
          species: data.species,
          category: data.category,
          description: data.description || null
        })
        .select()
        .single()

      if (medicationError) throw medicationError

      // Insert dosage guidelines
      const dosageGuidelines = data.dosage_guidelines.map(guideline => ({
        medication_id: medication.id,
        min_weight_kg: guideline.min_weight_kg,
        max_weight_kg: guideline.max_weight_kg,
        dosage_mg_per_kg: guideline.dosage_mg_per_kg,
        frequency_per_day: guideline.frequency_per_day,
        duration_days: guideline.duration_days || null,
        notes: guideline.notes || null
      }))

      const { error: guidelinesError } = await supabase
        .from('dosage_guidelines')
        .insert(dosageGuidelines)

      if (guidelinesError) throw guidelinesError

      // Success
      setIsOpen(false)
      reset()
      onMedicationAdded()
      alert('Medication added successfully!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      console.error('Error adding medication:', errorMessage)
      alert('Error adding medication: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const addDosageGuideline = () => {
    append({
      min_weight_kg: 1,
      max_weight_kg: 10,
      dosage_mg_per_kg: 1,
      frequency_per_day: 1,
      duration_days: 7,
      notes: ''
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Add a new medication with dosage guidelines to the database
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Rimadyl"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="generic_name">Generic Name</Label>
                <Input
                  id="generic_name"
                  placeholder="e.g., Carprofen"
                  {...register('generic_name')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select onValueChange={(value) => register('species').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Dogs & Cats</SelectItem>
                    <SelectItem value="dog">Dogs Only</SelectItem>
                    <SelectItem value="cat">Cats Only</SelectItem>
                  </SelectContent>
                </Select>
                {errors.species && (
                  <p className="text-sm text-red-600">{errors.species.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., NSAID, Antibiotic"
                  {...register('category')}
                />
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the medication"
                {...register('description')}
              />
            </div>
          </div>

          {/* Dosage Guidelines */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Dosage Guidelines</h3>
              <Button type="button" variant="outline" size="sm" onClick={addDosageGuideline}>
                <Plus className="h-4 w-4 mr-2" />
                Add Range
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Weight Range {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Min Weight (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`dosage_guidelines.${index}.min_weight_kg`, { valueAsNumber: true })}
                    />
                    {errors.dosage_guidelines?.[index]?.min_weight_kg && (
                      <p className="text-sm text-red-600">
                        {errors.dosage_guidelines[index]?.min_weight_kg?.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Max Weight (kg) *</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`dosage_guidelines.${index}.max_weight_kg`, { valueAsNumber: true })}
                    />
                    {errors.dosage_guidelines?.[index]?.max_weight_kg && (
                      <p className="text-sm text-red-600">
                        {errors.dosage_guidelines[index]?.max_weight_kg?.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Dosage (mg/kg) *</Label>
                    <Input
                      type="number"
                      step="0.001"
                      {...register(`dosage_guidelines.${index}.dosage_mg_per_kg`, { valueAsNumber: true })}
                    />
                    {errors.dosage_guidelines?.[index]?.dosage_mg_per_kg && (
                      <p className="text-sm text-red-600">
                        {errors.dosage_guidelines[index]?.dosage_mg_per_kg?.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Times/Day *</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`dosage_guidelines.${index}.frequency_per_day`, { valueAsNumber: true })}
                    />
                    {errors.dosage_guidelines?.[index]?.frequency_per_day && (
                      <p className="text-sm text-red-600">
                        {errors.dosage_guidelines[index]?.frequency_per_day?.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Duration (days)</Label>
                    <Input
                      type="number"
                      min="1"
                      {...register(`dosage_guidelines.${index}.duration_days`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes for this weight range"
                    {...register(`dosage_guidelines.${index}.notes`)}
                  />
                </div>
              </div>
            ))}
            
            {errors.dosage_guidelines && (
              <p className="text-sm text-red-600">
                {errors.dosage_guidelines.message || 'Please check dosage guidelines'}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding Medication...' : 'Add Medication'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
