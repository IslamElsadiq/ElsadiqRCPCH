import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { questions } from '../data/questions'
import { createSession } from '../lib/store'
import type { ExamMode } from '../lib/types'

const subtopics = [...new Set(questions.map((q) => q.subtopic))]

export default function ExamSetup() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const single = params.get('q')
  const [mode, setMode] = useState<ExamMode>('tutor')
  const [count, setCount] = useState(10)
  const [picked, setPicked] = useState<string[]>([])
  const [secondsPerQ, setSecondsPerQ] = useState(90)

  useEffect(() => {
    if (single) {
      createSession('tutor', [single], null)
      navigate('/exam/run', { replace: true })
    }
  }, [single, navigate])

  function toggle(s: string) {
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]))
  }

  function start() {
    const pool = picked.length ? questions.filter((q) => picked.includes(q.subtopic)) : questions
    const ids = pool.map((q) => q.id).slice(0, Math.min(count, pool.length))
    createSession(mode, ids, mode === 'timed' ? ids.length * secondsPerQ : null)
    navigate('/exam/run')
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>Build a test</h1>
        <p className="muted">Tutor mode gives instant feedback. Timed mode holds all feedback until you finish.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <div className="card card-pad">
          <h3 style={{ marginBottom: 14 }}>Mode</h3>
          {(['tutor', 'timed'] as const).map((m) => (
            <button
              key={m}
              className={`option ${mode === m ? 'selected' : ''}`}
              onClick={() => setMode(m)}
              style={{ marginBottom: 10 }}
            >
              <span className="letter">{m === 'tutor' ? 'T' : 'E'}</span>
              <span>
                <b>{m === 'tutor' ? 'Tutor mode' : 'Timed exam'}</b>
                <br />
                <span className="small muted">
                  {m === 'tutor'
                    ? 'Answer, then read why each option is right or wrong.'
                    : 'Countdown running, no feedback until the review screen.'}
                </span>
              </span>
            </button>
          ))}
          {mode === 'timed' && (
            <div className="field" style={{ marginTop: 8 }}>
              <label>Seconds per question</label>
              <input type="number" min={30} max={300} value={secondsPerQ} onChange={(e) => setSecondsPerQ(Number(e.target.value))} />
            </div>
          )}
        </div>
        <div className="card card-pad">
          <h3 style={{ marginBottom: 14 }}>Questions</h3>
          <div className="field">
            <label>How many? (bank has {questions.length})</label>
            <input type="number" min={1} max={questions.length} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <label className="small" style={{ fontWeight: 600, display: 'block', margin: '14px 0 8px' }}>
            Subtopics (leave empty for all)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {subtopics.map((s) => (
              <button
                key={s}
                className={`badge ${picked.includes(s) ? 'badge-brand' : 'badge-muted'}`}
                style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontSize: 13, padding: '6px 12px' }}
                onClick={() => toggle(s)}
              >
                {s} ({questions.filter((q) => q.subtopic === s).length})
              </button>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 22, width: '100%' }} onClick={start}>
            Start test
          </button>
        </div>
      </div>
    </div>
  )
}
