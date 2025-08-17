import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calculator, Heart, Plus, User, Database, Shield, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            How to Use the Veterinary Medication Calculator
          </h1>
          <p className="text-lg text-gray-600">
            A comprehensive guide for veterinarians and veterinary staff
          </p>
          <Link 
            href="/"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Calculator
          </Link>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="h-6 w-6" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get up and running in 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
                <h3 className="font-semibold mb-2">Select Species</h3>
                <p className="text-sm text-gray-600">Choose dogs, cats, or both</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">2</div>
                <h3 className="font-semibold mb-2">Pick Medication</h3>
                <p className="text-sm text-gray-600">Browse and select from the list</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                <h3 className="font-semibold mb-2">Enter Weight</h3>
                <p className="text-sm text-gray-600">Input animal weight and calculate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Instructions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Basic Dosage Calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li><strong>Select Animal Species:</strong> Use the dropdown to filter medications for dogs, cats, or both</li>
                  <li><strong>Browse Medications:</strong> Click on any medication card to select it</li>
                  <li><strong>Enter Animal Weight:</strong> Input the weight in kg or lbs (use the unit selector)</li>
                  <li><strong>Calculate Dosage:</strong> Click "Calculate Dosage" to get precise results</li>
                  <li><strong>Review Results:</strong> Check the calculated dosage, frequency, and duration</li>
                </ol>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Pro Tip:</strong> The calculator automatically finds the appropriate weight range for your patient and calculates the exact dosage needed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Favorites System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Using the Favorites System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Save your most frequently used medications for quick access:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Click the heart icon on any medication to add it to favorites</li>
                  <li>Switch to the "Favorites" tab to see only your saved medications</li>
                  <li>Favorites are personal and only visible to you</li>
                  <li>Click the heart again to remove from favorites</li>
                </ul>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You must be signed in to use the favorites system.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Adding New Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Adding New Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Expand the database with medications not currently listed:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Sign in to your account</li>
                  <li>Click "Add New Medication" at the bottom of the medication list</li>
                  <li>Fill in medication details (name, species, category, description)</li>
                  <li>Add dosage guidelines for different weight ranges</li>
                  <li>Save to make it available to all users</li>
                </ol>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Community Benefit:</strong> Medications you add become available to all veterinarians using the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account & Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Create an account to unlock advanced features:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Sign Up:</strong> Use your email to create an account</li>
                  <li><strong>Sign In:</strong> Access your favorites and add medications</li>
                  <li><strong>Profile:</strong> Your account is linked to your email</li>
                  <li><strong>Security:</strong> All data is encrypted and secure</li>
                </ul>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Free Account:</strong> No cost to create an account and use all features.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data & Safety */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data & Safety Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Understanding the medication database:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>All medications include FDA-approved dosage guidelines</li>
                  <li>Dosage ranges are based on veterinary literature and guidelines</li>
                  <li>Weight-based calculations ensure accurate dosing</li>
                  <li>Regular updates to reflect current veterinary standards</li>
                </ul>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Quality Assurance:</strong> All dosage guidelines are reviewed for accuracy and safety.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Important Disclaimers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Important Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">Professional Use Only</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    <li>This tool is for licensed veterinary professionals only</li>
                    <li>Always verify dosages against current veterinary literature</li>
                    <li>Consider individual patient factors (age, health status, etc.)</li>
                    <li>Consult with specialists for complex cases</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Limitations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    <li>Dosage calculations are estimates based on weight</li>
                    <li>Individual patient response may vary</li>
                    <li>Monitor patients closely after medication administration</li>
                    <li>Report adverse reactions to appropriate authorities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Troubleshooting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Troubleshooting Common Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">No Dosage Found</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If no dosage guideline appears for a weight:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Check if the weight is within the supported range</li>
                  <li>Verify the species selection matches your patient</li>
                  <li>Consider adding dosage guidelines for that weight range</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Authentication Issues</h4>
                <p className="text-sm text-gray-600 mb-2">
                  If you can't sign in:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Check your email and password</li>
                  <li>Verify your email confirmation if required</li>
                  <li>Try resetting your password</li>
                  <li>Contact support if issues persist</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              For technical support or to report issues:
            </p>
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                📧 Email Support
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                📖 Documentation
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                🐛 Report Bug
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
