'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react'

export function EnvError() {
  const [copied, setCopied] = useState(false)
  const [supabaseUrl, setSupabaseUrl] = useState<string>('')
  const [supabaseKey, setSupabaseKey] = useState<string>('')

  useEffect(() => {
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    setSupabaseKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (supabaseUrl && supabaseKey) {
    return null // Don't show error if env vars are set
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Environment Setup Required</CardTitle>
          <CardDescription className="text-lg">
            Your Supabase environment variables are not configured
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">To fix this error:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com</a> and create a new project</li>
              <li>Copy your project URL and anon key from Project Settings → API</li>
              <li>Update your <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> file</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Required Environment Variables:</h3>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={supabaseUrl || 'your_supabase_project_url_here'} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(supabaseUrl || 'your_supabase_project_url_here')}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {supabaseUrl ? '✓ Set' : '✗ Missing'} - Your Supabase project URL
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY</Label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={supabaseKey || 'your_supabase_anon_key_here'} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(supabaseKey || 'your_supabase_anon_key_here')}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {supabaseKey ? '✓ Set' : '✗ Missing'} - Your Supabase anon/public key
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => window.open('https://supabase.com', '_blank')}
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Go to Supabase
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>After setting up your environment variables, restart your dev server with:</p>
            <code className="bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
              npm run dev
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
