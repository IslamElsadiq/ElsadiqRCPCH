import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Bank from './pages/Bank'
import ExamSetup from './pages/ExamSetup'
import Exam from './pages/Exam'
import Review from './pages/Review'
import Article from './pages/Article'
import Flashcards from './pages/Flashcards'
import Banks from './pages/Banks'
import RequireAuth from './components/RequireAuth'
import RemoteSetup from './pages/RemoteSetup'
import RemoteExam from './pages/RemoteExam'
import RemoteReview from './pages/RemoteReview'
import RemoteDashboard from './pages/RemoteDashboard'
import { useRemote } from './lib/remote'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/dashboard" element={useRemote ? <RequireAuth><RemoteDashboard /></RequireAuth> : <Dashboard />} />
        <Route path="/banks" element={<Banks />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/exam" element={useRemote ? <RequireAuth><RemoteSetup /></RequireAuth> : <ExamSetup />} />
        <Route path="/exam/run" element={useRemote ? <RequireAuth><RemoteExam /></RequireAuth> : <Exam />} />
        <Route path="/exam/review" element={useRemote ? <RequireAuth><RemoteReview /></RequireAuth> : <Review />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/article/:id" element={<Article />} />
        </Route>
      </Routes>
    </>
  )
}
