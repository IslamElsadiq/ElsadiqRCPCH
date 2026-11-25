import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { finishRemote, loadRemote, pick, questionsByIds, saveRemote, type RemoteSession } from '../lib/remote'
import type { RemoteQuestion } from '../lib/api'
import ReportError from '../components/ReportError'
import LabPanel from '../components/LabPanel'

function Highlightable({ text }: { text: string }) {
  const [parts, setParts] = useState<string[] | null>(null)
  const [tick, setTick] = useState(0)
  function mark() {
    const sel = window.getSelection()
    const t = sel?.toString().trim()
    if (!t || !text.includes(t)) return
    const cur = parts ?? [text]
    const out: string[] = []
    let done = false
    for (const seg of cur) {
      const i = done || seg.startsWith('\u0001') ? -1 : seg.indexOf(t)
      if (i < 0) { out.push(seg); continue }
      done = true
      if (i > 0) out.push(seg.slice(0, i))
      out.push('\u0001' + t)
      if (i + t.length < seg.length) out.push(seg.slice(i + t.length))
    }
    setParts(out); sel?.removeAllRanges(); setTick(tick + 1)
  }
  return (
    <p className="stem-text" onMouseUp={mark} title="Select text to highlight it. Click a highlight to remove it.">
      {(parts ?? [text]).map((seg, i) => seg.startsWith('\u0001')
        ? <mark className="hl" key={i} onClick={() => setParts((parts ?? []).map((x, j) => (j === i ? x.slice(1) : x)))}>{seg.slice(1)}</mark>
        : <span key={i}>{seg}</span>)}
    </p>
  )
}

function useNote(id: string) {
  const k = `elsadiq-note-${id}`
  const [v, setV] = useState(() => localStorage.getItem(k) ?? '')
  useEffect(() => { setV(localStorage.getItem(k) ?? '') }, [k])
  return [v, (x: string) => { setV(x); localStorage.setItem(k, x) }] as const
}

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
  const [struck, setStruck] = useState<Record<string, boolean>>({})
  const [showLab, setShowLab] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showKeys, setShowKeys] = useState(false)

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

  const [note, setNote] = useNote(q?.id ?? '')
  const kb = useRef<(e: KeyboardEvent) => void>(() => {})
  useEffect(() => {
    const h = (e: KeyboardEvent) => kb.current(e)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

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

  kb.current = (e) => {
    const t = e.target as HTMLElement
    if (t && ['TEXTAREA', 'INPUT'].includes(t.tagName)) return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key.toLowerCase()
    const idx = 'abcdefgh'.indexOf(k)
    if (idx >= 0 && idx < q.options.length && k.length === 1) { choose(q.options[idx].label); return }
    if (k === 'arrowright' || k === 'enter') { if (s.current < total - 1) go(s.current + 1) }
    else if (k === 'arrowleft') { if (s.current > 0) go(s.current - 1) }
    else if (k === 'f') flag()
    else if (k === 'n') setShowNotes((v) => !v)
    else if (k === 'l') setShowLab((v) => !v)
    else if (k === '?') setShowKeys((v) => !v)
    else if (k === 'escape') { setShowLab(false); setShowKeys(false) }
  }

  return (
    <div className="container" style={{ maxWidth: 1040 }}>
      <div className="page-head" style={{ paddingBottom: 10 }}>
        <div className="exam-top">
          <span className="badge badge-brand">{tutor ? 'Tutor mode' : 'Timed exam'}</span>
          <span className="small muted">Question {s.current + 1} of {total}</span>
          <div className="exam-progress"><i style={{ width: `${(answeredCount / total) * 100}%` }} /></div>
          {remaining !== null && <span className={`timer ${remaining < 60 ? 'low' : ''}`}>{fmt(remaining)}</span>}
        </div>
      </div>
      <div className="exam-layout">
      <div>
      <div className="card card-pad">
        <div className="tool-row">
          <button className="btn btn-outline btn-sm" onClick={() => setShowLab(true)}>Reference values (L)</button>
          <button className="btn btn-outline btn-sm" onClick={() => setShowNotes(!showNotes)}>{note ? 'Notes •' : 'Notes'} (N)</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setShowKeys(true)}>Shortcuts (?)</button>
        </div>
        <div className="q-meta" style={{ marginBottom: 8 }}>
          {q.code && <span className="badge badge-muted">{q.code}</span>}
          {q.status !== 'published' && <span className="badge badge-accent">Draft</span>}
        </div>
        <Highlightable key={q.id} text={q.stem} />
        {showNotes && <div className="notes-box"><label className="small muted">Your note for this question (saved on this device)</label><textarea value={note} onChange={(e) => setNote(e.target.value)} /></div>}
        {q.options.map((o) => {
          const key = result?.options?.find((k) => k.label === o.label)
          let cls = 'option'
          if (tutor && result) { if (key?.is_correct) cls += ' correct'; else if (chosen === o.label) cls += ' wrong' }
          else if (chosen === o.label) cls += ' selected'
          return (
            <div key={o.id}>
              <div className="option-row">
              <button className={cls + (struck[o.id] ? ' struck' : '')} onClick={() => choose(o.label)} onContextMenu={(e) => { e.preventDefault(); setStruck({ ...struck, [o.id]: !struck[o.id] }) }} disabled={locked || busy}>
                <span className="letter">{o.label}</span><span>{o.body}</span>
              </button>
              {!locked && <button className="strike-btn" title="Strike out this option" onClick={() => setStruck({ ...struck, [o.id]: !struck[o.id] })}>S</button>}
              </div>
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
          <ReportError questionId={q.id} code={q.code ?? undefined} />
          <span className="spacer" />
          {s.current < total - 1
            ? <button className="btn btn-primary" onClick={() => go(s.current + 1)}>Next question</button>
            : <button className="btn btn-primary" onClick={finish} disabled={busy}>Finish and review</button>}
        </div>
      </div>
      </div>
      <div className="side-col">
        <div className="card card-pad"><b className="small">Questions</b>
      <div className="palette">
        {s.questionIds.map((id, i) => (
          <button key={id} className={`${s.picks[id] ? 'answered' : ''} ${s.flagged[id] ? 'flagged' : ''} ${i === s.current ? 'current' : ''}`} onClick={() => go(i)}>{i + 1}</button>
        ))}
      </div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>{answeredCount} of {total} answered</p>
        {!tutor && <button className="btn btn-primary btn-sm" style={{ marginTop: 10, width: '100%' }} onClick={finish} disabled={busy}>Finish exam</button>}
        </div>
      </div>
      </div>
      {showLab && <LabPanel onClose={() => setShowLab(false)} />}
      {showKeys && (
        <div className="slide-over"><div className="slide-head"><b>Keyboard shortcuts</b><button className="btn btn-ghost btn-sm" onClick={() => setShowKeys(false)}>Close</button></div>
          <div className="kbd-help"><kbd>A-E</kbd><span>Choose an option</span><kbd>Enter / →</kbd><span>Next question</span><kbd>←</kbd><span>Previous question</span><kbd>F</kbd><span>Flag question</span><kbd>N</kbd><span>Notes</span><kbd>L</kbd><span>Reference values</span><kbd>?</kbd><span>This help</span><kbd>Esc</kbd><span>Close panels</span></div>
          <p className="small muted">Right-click an option, or press its S button, to strike it out. Select text in the question to highlight it.</p>
        </div>
      )}
    </div>
  )
}
