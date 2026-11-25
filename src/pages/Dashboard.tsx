import { Link, useNavigate } from 'react-router-dom'
import { createSession, getErrors, getHistory, getProgress, weakQuestionIds } from '../lib/store'

export default function Dashboard() {
  const p = getProgress()
  const navigate = useNavigate()
  const errCounts = Object.values(getErrors()).reduce<Record<string, number>>((m, k) => ({ ...m, [k]: (m[k] || 0) + 1 }), {})
  const weakIds = weakQuestionIds(10)
  const history = getHistory().slice(-5).reverse()
  const entries = Object.entries(p.perSubtopic).sort(
    (a, b) => a[1].correct / Math.max(1, a[1].attempted) - b[1].correct / Math.max(1, b[1].attempted),
  )
  const weakest = entries[0]

  return (
    <div className="container">
      <div className="page-head">
        <h1>Your progress</h1>
        <p className="muted">First-attempt accuracy on every question you have seen, across all tests.</p>
      </div>
      <div className="dash-grid">
        <div className="card dash-stat">
          <b>{p.attempted}</b>
          <span>questions attempted</span>
        </div>
        <div className="card dash-stat">
          <b>{p.accuracy}%</b>
          <span>first-attempt accuracy</span>
        </div>
        <div className="card dash-stat">
          <b>{p.testsTaken}</b>
          <span>tests completed</span>
        </div>
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4 }}>Accuracy by subtopic</h3>
        <p className="small muted" style={{ marginTop: 0 }}>
          {p.unseen > 0 ? `${p.unseen} questions still unseen.` : 'You have seen every question in the bank.'}
          {weakest && weakest[1].attempted > 0 && (
            <> Weakest area: <b>{weakest[0]}</b>. </>
          )}
        </p>
        {entries.length === 0 && (
          <p className="muted">No attempts yet. <Link to="/exam">Take your first test</Link> and this page comes alive.</p>
        )}
        {entries.map(([name, st]) => (
          <div className="bar-row" key={name}>
            <span className="muted">{name}</span>
            <span className="bar-track">
              <span className="bar-fill" style={{ width: `${(st.correct / Math.max(1, st.attempted)) * 100}%` }} />
            </span>
            <span className="small muted">{st.correct}/{st.attempted}</span>
          </div>
        ))}
      </div>

      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 4 }}>Target your weak spots</h3>
        <p className="small muted" style={{ marginTop: 0 }}>Builds a test from questions you got wrong plus ones you have not seen.</p>
        <button className="btn btn-primary btn-sm" disabled={weakIds.length === 0} onClick={() => { createSession('tutor', weakIds, null); navigate('/exam/run') }}>
          Start weak-spot test ({weakIds.length})
        </button>
        {Object.keys(errCounts).length > 0 && (
          <p className="small muted" style={{ marginBottom: 0 }}>Why you miss: {Object.entries(errCounts).map(([k, n]) => `${k.replace('_', ' ')} ${n}`).join(' · ')}</p>
        )}
      </div>

      <div className="card card-pad">
        <h3 style={{ marginBottom: 12 }}>Recent tests</h3>
        {history.length === 0 && <p className="muted">Nothing yet.</p>}
        {history.map((t) => (
          <div key={t.id} className="bar-row" style={{ gridTemplateColumns: '1fr auto auto' }}>
            <span>
              {t.mode === 'tutor' ? 'Tutor mode' : 'Timed exam'} · {new Date(t.finishedAt).toLocaleDateString()}
            </span>
            <span className="badge badge-brand">{t.correct}/{t.total}</span>
            <Link to="/exam/review" className="small">Review</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
