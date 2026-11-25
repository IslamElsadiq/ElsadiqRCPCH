import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isDemo } from '../lib/supabase'
import { demoLogout, isLoggedIn } from '../lib/store'

function themeInit(): 'light' | 'dark' {
  return (localStorage.getItem('elsadiqrcph.theme') as 'light' | 'dark') || 'light'
}

export default function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>(themeInit)
  const [loggedIn, setLoggedIn] = useState(isLoggedIn())
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
            {loggedIn ? (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  demoLogout()
                  setLoggedIn(false)
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
