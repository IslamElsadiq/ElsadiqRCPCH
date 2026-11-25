import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrors, getHistory, getNotes, getQuestion, makeCardFromQuestion, saveNote, tagError, type ErrorReason } from '../lib/store'

type Filter = 'all' | 'incorrect' | 'flagged'

export default function Review() {
  const navigate = useNavigate()
  const history = getHistory()
  const test = history[history.length - 1]
  const [filter, setFilter] = useState<Filter>('all')
  const [notes, setNotes] = useState(getNotes())
  const [errs, setErrs] = useState(getErrors())
  const [msg, setMsg] = useState('')

  const rows = useMemo(() => {
    if (!test) return []
    return test.questionIds
      .map((id, i) => ({ q: getQuestion(id)!, a: test.answers[id], i }))
      .filter(({ q, a }) => {
        if (filter === 'incorrect') return a && a.chosen !== null && !a.correct
        if (filter === 'flagged') return a?.flagged
        return true
      })
  }, [test, filter])

  if (!test) {
    navigate('/exam')
    return null
  }

  const pct = test.total ? Math.round((test.correct / test.total) * 100) : 0
  const R = 54
  const C = 2 * Math.PI * R

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="page-head">
        <h1>Test review</h1>
        <p className="muted">{test.mode === 'tutor' ? 'Tutor mode' : 'Timed exam'} · finished {new Date(test.finishedAt).toLocaleString()}</p>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="score-ring">
          <div className="ring">
            <svg width="132" height="132">
              <circle cx="66" cy="66" r={R} fill="none" stroke="var(--bg-soft)" strokeWidth="12" />
              <circle
                cx="66" cy="66" r={R} fill="none" stroke="var(--brand)" strokeWidth="12"
                strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} strokeLinecap="round"
              />
            </svg>
            <div className="ring-label">{pct}%</div>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ marginBottom: 10 }}>
              {test.correct} of {test.total} correct
            </h3>
            {Object.entries(test.perSubtopic).map(([name, st]) => (
              <div className="bar-row" key={name}>
                <span className="muted">{name}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${st.attempted ? (st.correct / st.attempted) * 100 : 0}%` }} />
                </span>
                <span className="small muted">{st.correct}/{st.attempted}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bank-row">
        {(['all', 'incorrect', 'flagged'] as const).map((f) => (
          <button
            key={f}
            className={`badge ${filter === f ? 'badge-brand' : 'badge-muted'}`}
            style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontSize: 13, padding: '7px 14px' }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${test.questionIds.length})` : f === 'incorrect' ? 'Incorrect' : 'Flagged'}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <Link to="/exam" className="btn btn-primary btn-sm">New test</Link>
      </div>

      {rows.length === 0 && <p className="muted">Nothing matches this filter.</p>}
      {rows.map(({ q, a, i }) => (
        <div className="card review-item" key={q.id}>
          <div className="q-meta" style={{ marginBottom: 8 }}>
            <span className="badge badge-muted">Q{i + 1} · {q.id}</span>
            <span className="badge badge-brand">{q.subtopic}</span>
            {a?.chosen === null || !a ? (
              <span className="badge badge-muted">Unanswered</span>
            ) : a.correct ? (
              <span className="badge badge-ok">Correct</span>
            ) : (
              <span className="badge badge-danger">Incorrect</span>
            )}
            {a?.flagged && <span className="badge badge-accent">Flagged</span>}
          </div>
          <p className="stem-text" style={{ fontSize: 16 }}>{q.stem}</p>
          {q.options.map((o) => {
            let cls = 'option'
            if (o.isCorrect) cls += ' correct'
            else if (a?.chosen === o.label) cls += ' wrong'
            return (
              <div key={o.label}>
                <div className={cls} style={{ cursor: 'default' }}>
                  <span className="letter">{o.label}</span>
                  <span>{o.text}</span>
                </div>
                <div className="option-expl">{o.explanation}</div>
              </div>
            )
          })}
          <div className="keypoint">
            <b>Key point:</b> {q.keyPoint}
          </div>
          <div className="reference">Reference: {q.reference}</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            {a?.chosen && !a.correct && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className="small muted">Why did you miss it?</span>
                {([['knowledge_gap', 'Knowledge gap'], ['misread', 'Misread'], ['careless', 'Careless'], ['guess', 'Guess']] as [ErrorReason, string][]).map(([k, label]) => (
                  <button key={k} className={`badge ${errs[q.id] === k ? 'badge-brand' : 'badge-muted'}`} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontSize: 12.5, padding: '5px 11px' }}
                    onClick={() => { tagError(q.id, errs[q.id] === k ? null : k); setErrs(getErrors()) }}>{label}</button>
                ))}
              </div>
            )}
            <textarea placeholder="Your note on this question" value={notes[q.id] || ''} rows={2}
              style={{ font: 'inherit', padding: 10, borderRadius: 9, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}
              onChange={(e) => { saveNote(q.id, e.target.value); setNotes(getNotes()) }} />
            <div><button className="btn btn-outline btn-sm" onClick={() => setMsg(makeCardFromQuestion(q) ? `Card added for ${q.id}` : `${q.id} already has a card`)}>Make flashcard</button></div>
          </div>
        </div>
      ))}
      {msg && <p className="small muted">{msg}</p>}
    </div>
  )
}
