import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { createDraftTest, createTest, fetchQuestions } from '../lib/remote'

export default function RemoteSetup() {
  const navigate = useNavigate()
  const { showDrafts } = useAuth()
  const [params] = useSearchParams()
  const single = params.get('q')
  const [mode, setMode] = useState<'tutor' | 'timed'>('tutor')
  const [count, setCount] = useState(10)
  const [secs, setSecs] = useState(90)
  const [unseen, setUnseen] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function run(fn: () => Promise<unknown>) {
    setBusy(true); setErr(null)
    try { await fn(); navigate('/exam/run', { replace: true }) }
    catch (e: any) { setErr(e.message?.includes('no questions') ? 'No questions match. Published questions only appear for students; ask the editor to publish.' : e.message); setBusy(false) }
  }

  useEffect(() => {
    if (!single) return
    run(async () => {
      const all = await fetchQuestions()
      const q = all.find((x) => x.code === single)
      if (!q) throw new Error('Question not found or not published')
      await createDraftTest([q.id], 'tutor', null)
    })
  }, [single])

  function start() {
    run(async () => {
      const limit = mode === 'timed' ? count * secs : null
      if (showDrafts) {
        const all = (await fetchQuestions()).slice(0, count)
        if (!all.length) throw new Error('no questions')
        await createDraftTest(all.map((q) => q.id), mode, limit)
      } else {
        await createTest({ mode, count, unseenOnly: unseen, onlyWrong: wrong, timeLimitSec: limit })
      }
    })
  }

  return (
    <div className="container">
      <div className="page-head"><h1>Build a test</h1><p className="muted">Tutor mode gives instant feedback. Timed mode holds all feedback until you finish.{showDrafts ? ' Draft questions are included (staff view).' : ''}</p></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <div className="card card-pad">
          <h3 style={{ marginBottom: 14 }}>Mode</h3>
          {(['tutor', 'timed'] as const).map((m) => (
            <button key={m} className={`option ${mode === m ? 'selected' : ''}`} onClick={() => setMode(m)} style={{ marginBottom: 10 }}>
              <span className="letter">{m === 'tutor' ? 'T' : 'E'}</span>
              <span><b>{m === 'tutor' ? 'Tutor mode' : 'Timed exam'}</b><br /><span className="small muted">{m === 'tutor' ? 'Answer, then read why each option is right or wrong.' : 'Countdown running, no feedback until the review screen.'}</span></span>
            </button>
          ))}
          {mode === 'timed' && <div className="field"><label>Seconds per question</label><input type="number" min={30} max={300} value={secs} onChange={(e) => setSecs(Number(e.target.value))} /></div>}
        </div>
        <div className="card card-pad">
          <h3 style={{ marginBottom: 14 }}>Questions</h3>
          <div className="field"><label>How many?</label><input type="number" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value))} /></div>
          {!showDrafts && (
            <>
              <label className="small" style={{ display: 'flex', gap: 8, margin: '8px 0' }}><input type="checkbox" checked={unseen} onChange={(e) => setUnseen(e.target.checked)} /> Only questions I have not seen</label>
              <label className="small" style={{ display: 'flex', gap: 8, margin: '8px 0' }}><input type="checkbox" checked={wrong} onChange={(e) => setWrong(e.target.checked)} /> Only questions I got wrong before</label>
            </>
          )}
          {err && <p className="small" style={{ color: 'var(--danger)' }}>{err}</p>}
          <button className="btn btn-primary" style={{ marginTop: 14, width: '100%' }} disabled={busy} onClick={start}>{busy ? 'Starting…' : 'Start test'}</button>
        </div>
      </div>
    </div>
  )
}
