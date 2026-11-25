import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { finishRemote, loadRemote, pick, questionsByIds, saveRemote, type RemoteSession } from '../lib/remote'
import type { RemoteQuestion } from '../lib/api'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function RemoteExam() {
  const navigate = useNavigate()
  const [s, setS] = useState<RemoteSession | null>(() => loadRemote())
  const [qs, setQs] = useState<RemoteQuestion[]>([])
  const [now, setNow] = useState(Date.now())
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const qStart = useRef(Date.now())
  const finishing = useRef(false)

  useEffect(() => { if (!s) navigate('/exam') }, [s, navigate])
  useEffect(() => {
    if (s) questionsByIds(s.questionIds).then(setQs).catch((e) => setErr(e.message))
  }, [s?.testId])
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])

  const q = useMemo(() => (s ? qs.find((x) => x.id === s.questionIds[s.current]) : undefined), [s, qs])
  const remaining = s && s.timeLimitSec ? Math.max(0, s.timeLimitSec - Math.floor((now - s.startedAt) / 1000)) : null

  async function finish() {
    if (!s || finishing.current) return
    finishing.current = true
    setBusy(true)
    try { await finishRemote(s); navigate('/exam/review') }
    catch (e: any) { setErr(e.message); finishing.current = false; setBusy(false) }
  }
  useEffect(() => { if (remaining === 0) finish() }, [remaining])

  if (!s) return null
  if (err) return <div className="container"><p className="small" style={{ color: 'var(--danger)', marginTop: 40 }}>{err}</p></div>
  if (!q) return <div className="container"><p className="muted" style={{ marginTop: 40 }}>Loading questions…</p></div>

  const tutor = s.mode === 'tutor'
  const chosen = s.picks[q.id]?.label
  const result = s.results[q.id]
  const locked = tutor && !!chosen
  const answeredCount = Object.keys(s.picks).length
  const total = s.questionIds.length

  async function choose(label: string) {
    if (locked || busy) return
    setBusy(true)
    try { setS(await pick(s!, q!, label, Date.now() - qStart.current)) }
    catch (e: any) { setErr(e.message) }
    setBusy(false)
  }
  function go(i: number) {
    const n = { ...s!, current: i }; saveRemote(n); setS(n); qStart.current = Date.now()
  }
  function flag() { const n = { ...s!, flagged: { ...s!.flagged, [q!.id]: !s!.flagged[q!.id] } }; saveRemote(n); setS(n) }

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="page-head" style={{ paddingBottom: 10 }}>
        <div className="exam-top">
          <span className="badge badge-brand">{tutor ? 'Tutor mode' : 'Timed exam'}</span>
          <span className="small muted">Question {s.current + 1} of {total}</span>
          <div className="exam-progress"><i style={{ width: `${(answeredCount / total) * 100}%` }} /></div>
          {remaining !== null && <span className={`timer ${remaining < 60 ? 'low' : ''}`}>{fmt(remaining)}</span>}
        </div>
      </div>
      <div className="card card-pad">
        <div className="q-meta" style={{ marginBottom: 8 }}>
          {q.code && <span className="badge badge-muted">{q.code}</span>}
          {q.status !== 'published' && <span className="badge badge-accent">Draft</span>}
        </div>
        <p className="stem-text">{q.stem}</p>
        {q.options.map((o) => {
          const key = result?.options?.find((k) => k.label === o.label)
          let cls = 'option'
          if (tutor && result) { if (key?.is_correct) cls += ' correct'; else if (chosen === o.label) cls += ' wrong' }
          else if (chosen === o.label) cls += ' selected'
          return (
            <div key={o.id}>
              <button className={cls} onClick={() => choose(o.label)} disabled={locked || busy}>
                <span className="letter">{o.label}</span><span>{o.body}</span>
              </button>
              {key && <div className="option-expl">{key.explanation}</div>}
            </div>
          )
        })}
        {tutor && result && (
          <>
            {result.key_point && <div className="keypoint"><b>Key point:</b> {result.key_point}</div>}
            {result.reference && <div className="reference">Reference: {result.reference}</div>}
          </>
        )}
        <div className="exam-nav">
          <button className="btn btn-ghost" onClick={() => go(s.current - 1)} disabled={s.current === 0}>Previous</button>
          <button className="btn btn-outline btn-sm" onClick={flag}>{s.flagged[q.id] ? 'Unflag' : 'Flag for review'}</button>
          <span className="spacer" />
          {s.current < total - 1
            ? <button className="btn btn-primary" onClick={() => go(s.current + 1)}>Next question</button>
            : <button className="btn btn-primary" onClick={finish} disabled={busy}>Finish and review</button>}
        </div>
      </div>
      <div className="palette">
        {s.questionIds.map((id, i) => (
          <button key={id} className={`${s.picks[id] ? 'answered' : ''} ${s.flagged[id] ? 'flagged' : ''} ${i === s.current ? 'current' : ''}`} onClick={() => go(i)}>{i + 1}</button>
        ))}
      </div>
    </div>
  )
}
