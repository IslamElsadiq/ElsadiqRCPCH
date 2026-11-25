import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createTest, fetchProgress, type RemoteProgress } from '../lib/remote'

export default function RemoteDashboard() {
  const navigate = useNavigate()
  const [p, setP] = useState<RemoteProgress | null>(null)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => { fetchProgress().then(setP).catch((e) => setErr(e.message)) }, [])
  async function weak(kind: 'wrong' | 'unseen') {
    try { await createTest({ mode: 'tutor', count: 10, onlyWrong: kind === 'wrong', unseenOnly: kind === 'unseen' }); navigate('/exam/run') }
    catch (e: any) { setErr(e.message) }
  }
  if (err) return <div className="container"><p className="small" style={{ color: 'var(--danger)', marginTop: 40 }}>{err}</p></div>
  if (!p) return <div className="container"><p className="muted" style={{ marginTop: 40 }}>Loading…</p></div>
  const rows = [...p.byTopic].sort((a, b) => a.correct / Math.max(1, a.attempted) - b.correct / Math.max(1, b.attempted))
  return (
    <div className="container">
      <div className="page-head"><h1>Your progress</h1><p className="muted">Saved to your account.</p></div>
      <div className="dash-grid">
        <div className="card dash-stat"><b>{p.attempted}</b><span>answers recorded</span></div>
        <div className="card dash-stat"><b>{p.attempted ? `${p.accuracy}%` : '-'}</b><span>accuracy</span></div>
        <div className="card dash-stat"><b>{p.tests}</b><span>tests completed</span></div>
      </div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4 }}>Accuracy by topic</h3>
        {rows.length === 0 && <p className="muted">No attempts yet. <Link to="/exam">Take your first test</Link>.</p>}
        {rows.map((r) => (
          <div className="bar-row" key={r.name}>
            <span className="muted">{r.name}</span>
            <span className="bar-track"><span className="bar-fill" style={{ width: `${(r.correct / Math.max(1, r.attempted)) * 100}%` }} /></span>
            <span className="small muted">{r.correct}/{r.attempted}</span>
          </div>
        ))}
      </div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4 }}>Target your weak spots</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => weak('wrong')}>Questions I got wrong</button>
          <button className="btn btn-outline btn-sm" onClick={() => weak('unseen')}>Questions I have not seen</button>
        </div>
      </div>
      <div className="card card-pad">
        <h3 style={{ marginBottom: 12 }}>Recent tests</h3>
        {p.recent.length === 0 && <p className="muted">Nothing yet.</p>}
        {p.recent.map((t) => (
          <div key={t.id} className="bar-row" style={{ gridTemplateColumns: '1fr auto' }}>
            <span>{t.mode === 'tutor' ? 'Tutor mode' : 'Timed exam'} · {new Date(t.at).toLocaleDateString()}</span>
            <span className="badge badge-brand">{t.correct}/{t.total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
