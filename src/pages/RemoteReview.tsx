import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { answerRows, loadLast, questionsByIds, reviewKeys } from '../lib/remote'
import type { RemoteQuestion, SubmitResult } from '../lib/api'

export default function RemoteReview() {
  const navigate = useNavigate()
  const s = loadLast()
  const [qs, setQs] = useState<RemoteQuestion[]>([])
  const [keys, setKeys] = useState<Record<string, SubmitResult>>(s?.results ?? {})
  const [correctMap, setCorrectMap] = useState<Record<string, boolean>>({})
  const [noKeys, setNoKeys] = useState(false)
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'flagged'>('all')

  useEffect(() => {
    if (!s) { navigate('/exam'); return }
    questionsByIds(s.questionIds).then(setQs)
    answerRows(s.testId).then((rows) => setCorrectMap(Object.fromEntries(rows.map((r) => [r.question_id, r.is_correct]))))
    if (s.mode === 'timed') reviewKeys(s.testId).then((k) => (k ? setKeys(k) : setNoKeys(true)))
  }, [])

  if (!s) return null
  const total = s.summary?.total ?? s.questionIds.length
  const correct = s.summary?.correct ?? 0
  const pct = total ? Math.round((correct / total) * 100) : 0
  const R = 54, C = 2 * Math.PI * R
  const rows = qs.filter((q) => {
    if (filter === 'incorrect') return s.picks[q.id] && correctMap[q.id] === false
    if (filter === 'flagged') return s.flagged[q.id]
    return true
  })

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="page-head"><h1>Test review</h1><p className="muted">{s.mode === 'tutor' ? 'Tutor mode' : 'Timed exam'}</p></div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="score-ring">
          <div className="ring">
            <svg width="132" height="132">
              <circle cx="66" cy="66" r={R} fill="none" stroke="var(--bg-soft)" strokeWidth="12" />
              <circle cx="66" cy="66" r={R} fill="none" stroke="var(--brand)" strokeWidth="12" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} strokeLinecap="round" />
            </svg>
            <div className="ring-label">{pct}%</div>
          </div>
          <h3>{correct} of {total} correct</h3>
        </div>
      </div>
      {noKeys && <p className="small muted">Per-option explanations for timed tests are not available from the server yet. Correct and incorrect marks are shown.</p>}
      <div className="bank-row">
        {(['all', 'incorrect', 'flagged'] as const).map((f) => (
          <button key={f} className={`badge ${filter === f ? 'badge-brand' : 'badge-muted'}`} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontSize: 13, padding: '7px 14px' }} onClick={() => setFilter(f)}>
            {f === 'all' ? `All (${s.questionIds.length})` : f === 'incorrect' ? 'Incorrect' : 'Flagged'}
          </button>
        ))}
        <span style={{ flex: 1 }} /><Link to="/banks" className="btn btn-primary btn-sm">New test</Link>
      </div>
      {rows.map((q, i) => {
        const chosen = s.picks[q.id]?.label
        const k = keys[q.id]
        const ok = correctMap[q.id]
        return (
          <div className="card review-item" key={q.id}>
            <div className="q-meta" style={{ marginBottom: 8 }}>
              <span className="badge badge-muted">Q{s.questionIds.indexOf(q.id) + 1}{q.code ? ` · ${q.code}` : ''}</span>
              {!chosen ? <span className="badge badge-muted">Unanswered</span> : ok === undefined ? null : ok ? <span className="badge badge-ok">Correct</span> : <span className="badge badge-danger">Incorrect</span>}
              {s.flagged[q.id] && <span className="badge badge-accent">Flagged</span>}
            </div>
            <p className="stem-text" style={{ fontSize: 16 }}>{q.stem}</p>
            {q.options.map((o) => {
              const key = k?.options?.find((x) => x.label === o.label)
              let cls = 'option'
              if (key?.is_correct) cls += ' correct'; else if (chosen === o.label) cls += ' wrong'
              return (
                <div key={o.id}>
                  <div className={cls} style={{ cursor: 'default' }}><span className="letter">{o.label}</span><span>{o.body}</span></div>
                  {key?.explanation && <div className="option-expl">{key.explanation}</div>}
                </div>
              )
            })}
            {k?.key_point && <div className="keypoint"><b>Key point:</b> {k.key_point}</div>}
            {k?.reference && <div className="reference">Reference: {k.reference}</div>}
          </div>
        )
      })}
    </div>
  )
}
