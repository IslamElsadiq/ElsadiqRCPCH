import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isDemo, supabase } from '../lib/supabase'
import { demoLogin } from '../lib/store'

export default function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    if (isDemo) {
      demoLogin()
      navigate('/dashboard')
      return
    }
    try {
      if (mode === 'signup') {
        const { error } = await supabase!.auth.signUp({
          email,
          password,
          options: { data: { display_name: name } },
        })
        if (error) throw error
      } else {
        const { error } = await supabase!.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="card card-pad">
          <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="muted small" style={{ marginTop: -6, marginBottom: 22 }}>
            {mode === 'login'
              ? 'Sign in to sync your progress across devices.'
              : 'Free account. Your progress and test history stay yours.'}
          </p>
          <form onSubmit={submit}>
            {mode === 'signup' && (
              <div className="field">
                <label htmlFor="name">Display name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr Islam" required />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            {error && <p className="small" style={{ color: 'var(--danger)' }}>{error}</p>}
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          <div className="divider">or</div>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => {
              demoLogin()
              navigate('/dashboard')
            }}
          >
            Continue with Google
          </button>
          <p className="small muted" style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
            {mode === 'login' ? (
              <>New here? <Link to="/signup">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
