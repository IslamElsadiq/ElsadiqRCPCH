import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { loggedIn } = useAuth()
  if (loggedIn) return <>{children}</>
  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="card card-pad">
          <h1>Sign in to continue</h1>
          <p className="muted small">Tests and progress are saved to your account.</p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Sign in</Link>
          <p className="small muted" style={{ textAlign: 'center', marginBottom: 0 }}>New here? <Link to="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
