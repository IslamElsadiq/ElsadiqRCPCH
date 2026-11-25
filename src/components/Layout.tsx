import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isDemo } from '../lib/supabase'
import { useAuth } from '../lib/auth'

function themeInit(): 'light' | 'dark' {
  return (localStorage.getItem('elsadiqrcph.theme') as 'light' | 'dark') || 'light'
}

export default function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>(themeInit)
  const { loggedIn, isStaff, showDrafts, setShowDrafts, signOut } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('elsadiqrcph.theme', theme)
  }, [theme])

  return (
    <>
      {isDemo && (
        <div className="demo-banner">
          Preview build running on local data. Connect Supabase keys to enable accounts and synced progress.
        </div>
      )}
      <header className="nav">
        <div className="container nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">E</span>
            <span>
              Elsadiq<em>RCPCH</em>
            </span>
          </Link>
          <nav className="nav-links">
            <NavLink to="/banks">Banks</NavLink>
            <NavLink to="/bank">Questions</NavLink>
            <NavLink to="/exam">Exam mode</NavLink>
            <NavLink to="/article/ART-NJ-001">Library</NavLink>
            <NavLink to="/flashcards">Flashcards</NavLink>
            <NavLink to="/dashboard">Progress</NavLink>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Toggle theme"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            {isStaff && (
              <label className="small" style={{ display: 'flex', gap: 6, alignItems: 'center', margin: '0 6px', color: 'var(--accent)', fontWeight: 600 }}>
                <input type="checkbox" checked={showDrafts} onChange={(e) => setShowDrafts(e.target.checked)} />
                Show drafts
              </label>
            )}
            {loggedIn ? (
              <button
                className="btn btn-outline btn-sm"
                onClick={async () => {
                  await signOut()
                  navigate('/')
                }}
              >
                Sign out
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container cols">
          <div>
            <b style={{ color: 'var(--ink)' }}>ElsadiqRCPCH</b>
            <div>Original MRCPCH revision content.</div>
            <div>All questions are drafts pending clinical review.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Built with React, TypeScript and Supabase.</div>
            <div>Primary reference: NICE CG98 (Oct 2023).</div>
          </div>
        </div>
      </footer>
    </>
  )
}
