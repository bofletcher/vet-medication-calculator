'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'

export function AuthButton() {
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

  const signOut = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) return
    
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Sign out error:', error.message)
  }

  if (loading) {
    return <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Welcome, {user.email || 'User'}
        </span>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <Link href="/signin">
      <Button variant="outline">
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    </Link>
  )
}
