import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { finishSession, getQuestion, loadSession, recordAnswer, saveSession, toggleFlag } from '../lib/store'
import type { ExamSession } from '../lib/types'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Exam() {
  const navigate = useNavigate()
  const [session, setSession] = useState<ExamSession | null>(() => loadSession())
  const [startedAt, setStartedAt] = useState(Date.now())
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!session) navigate('/exam')
  }, [session, navigate])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const question = useMemo(
    () => (session ? getQuestion(session.questionIds[session.current]) : undefined),
    [session],
  )

  const remainingNow =
    session && session.timeLimitSec !== null
      ? Math.max(0, session.timeLimitSec - Math.floor((now - session.startedAt) / 1000))
      : null

  useEffect(() => {
    if (session && !session.finishedAt && remainingNow === 0) {
      finishSession(session)
      navigate('/exam/review')
    }
  }, [remainingNow, session, navigate])

  if (!session || !question) return null

  const answer = session.answers[question.id]
  const answered = answer !== undefined && answer.chosen !== null
  const isTutor = session.mode === 'tutor'
  const total = session.questionIds.length
  const answeredCount = Object.values(session.answers).filter((a) => a.chosen !== null).length

  const remaining = remainingNow

  function choose(label: string) {
    if (answered && isTutor) return
    const next = recordAnswer(session!, question!, label, Date.now() - startedAt)
    setSession({ ...next })
  }

  function go(i: number) {
    const next = { ...session!, current: i }
    saveSession(next)
    setSession(next)
    setStartedAt(Date.now())
  }

  function flag() {
    setSession({ ...toggleFlag(session!, question!.id) })
  }

  function finish() {
    finishSession(session!)
    navigate('/exam/review')
  }

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      <div className="page-head" style={{ paddingBottom: 10 }}>
        <div className="exam-top">
          <span className="badge badge-brand">{isTutor ? 'Tutor mode' : 'Timed exam'}</span>
          <span className="small muted">
            Question {session.current + 1} of {total}
          </span>
          <div className="exam-progress">
            <i style={{ width: `${(answeredCount / total) * 100}%` }} />
          </div>
          {remaining !== null && <span className={`timer ${remaining < 60 ? 'low' : ''}`}>{fmt(remaining)}</span>}
        </div>
      </div>

      <div className="card card-pad">
        <div className="q-meta" style={{ marginBottom: 8 }}>
          <span className="badge badge-muted">{question.id}</span>
          <span className="badge badge-brand">{question.subtopic}</span>
          <span className={`badge ${question.difficulty === 'Easy' ? 'badge-ok' : question.difficulty === 'Hard' ? 'badge-danger' : 'badge-accent'}`}>
            {question.difficulty}
          </span>
        </div>
        <p className="stem-text">{question.stem}</p>

        {question.options.map((o) => {
          let cls = 'option'
          if (isTutor && answered) {
            if (o.isCorrect) cls += ' correct'
            else if (answer.chosen === o.label) cls += ' wrong'
          } else if (answer?.chosen === o.label) {
            cls += ' selected'
          }
          return (
            <div key={o.label}>
              <button className={cls} onClick={() => choose(o.label)} disabled={isTutor && answered}>
                <span className="letter">{o.label}</span>
                <span>{o.text}</span>
              </button>
              {isTutor && answered && <div className="option-expl">{o.explanation}</div>}
            </div>
          )
        })}

        {isTutor && answered && (
          <>
            <div className="keypoint">
              <b>Key point:</b> {question.keyPoint}
            </div>
            <div className="reference">Reference: {question.reference}</div>
          </>
        )}

        <div className="exam-nav">
          <button className="btn btn-ghost" onClick={() => go(session.current - 1)} disabled={session.current === 0}>
            Previous
          </button>
          <button className={`btn btn-outline btn-sm`} onClick={flag}>
            {answer?.flagged ? 'Unflag' : 'Flag for review'}
          </button>
          <span className="spacer" />
          {session.current < total - 1 ? (
            <button className="btn btn-primary" onClick={() => go(session.current + 1)}>
              Next question
            </button>
          ) : (
            <button className="btn btn-primary" onClick={finish}>
              Finish and review
            </button>
          )}
        </div>
      </div>

      <div className="palette">
        {session.questionIds.map((id, i) => {
          const a = session.answers[id]
          let cls = ''
          if (a?.chosen) cls += ' answered'
          if (a?.flagged) cls += ' flagged'
          if (i === session.current) cls += ' current'
          return (
            <button key={id} className={cls} onClick={() => go(i)}>
              {i + 1}
            </button>
          )
        })}
      </div>
      <p className="small faint" style={{ marginTop: 14 }}>
        Content status: draft, pending clinical review. <Link to="/article/ART-NJ-001">Read the linked article</Link>
      </p>
    </div>
  )
}
