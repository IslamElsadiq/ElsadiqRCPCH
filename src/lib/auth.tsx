import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isDemo, supabase } from './supabase'
import { demoLogout, isLoggedIn } from './store'

interface AuthState {
  session: Session | null
  loggedIn: boolean
  role: 'student' | 'editor' | 'admin' | null
  isStaff: boolean
  showDrafts: boolean
  setShowDrafts: (v: boolean) => void
  signOut: () => Promise<void>
}

const Ctx = createContext<AuthState>({
  session: null, loggedIn: false, role: null, isStaff: false,
  showDrafts: false, setShowDrafts: () => {}, signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<AuthState['role']>(null)
  const [demoIn, setDemoIn] = useState(isLoggedIn())
  const [showDrafts, setShowDraftsRaw] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) { setRole(null); setShowDraftsRaw(false); return }
    supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => setRole((data?.role as AuthState['role']) ?? 'student'))
  }, [session])

  const isStaff = role === 'admin' || role === 'editor'
  // drafts are visible only to signed-in staff; the server RLS enforces the same rule
  const setShowDrafts = (v: boolean) => setShowDraftsRaw(v && isStaff)

  async function signOut() {
    if (supabase) await supabase.auth.signOut()
    demoLogout(); setDemoIn(false)
  }

  return (
    <Ctx.Provider value={{
      session, loggedIn: isDemo ? demoIn : !!session, role, isStaff,
      showDrafts: showDrafts && isStaff, setShowDrafts, signOut,
    }}>{children}</Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
