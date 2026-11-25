import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questions } from '../data/questions'
import { createSession, getProgress } from '../lib/store'

interface Bank {
  id: string
  track: string
  kind: 'qbank' | 'mock'
  title: string
  blurb: string
  ids: string[]
  timedSecPerQ?: number
}

const ids = questions.map((q) => q.id)
const banks: Bank[] = [
  { id: 'nj1', track: 'MRCPCH', kind: 'qbank', title: 'Neonatal jaundice, batch 1', blurb: 'Assessment, causes, phototherapy, prolonged jaundice and complications.', ids },
  { id: 'nj-hard', track: 'MRCPCH', kind: 'qbank', title: 'Neonatal jaundice, hard only', blurb: 'The harder items from batch 1 for a final push.', ids: questions.filter((q) => q.difficulty === 'Hard').map((q) => q.id) },
  { id: 'mock1', track: 'MRCPCH', kind: 'mock', title: 'Timed mock: neonatal jaundice', blurb: 'All 20 questions, 90 seconds each, no feedback until the end.', ids, timedSecPerQ: 90 },
]

const tracks = ['MRCPCH']

export default function Banks() {
  const navigate = useNavigate()
  const p = getProgress()
  const [track, setTrack] = useState('MRCPCH')
  const [tab, setTab] = useState<'qbank' | 'mock'>('qbank')
  const [search, setSearch] = useState('')

  const shown = banks.filter(
    (b) => b.track === track && b.kind === tab && (!search || b.title.toLowerCase().includes(search.toLowerCase())),
  )
  const trackBanks = banks.filter((b) => b.track === track)

  function start(b: Bank) {
    createSession(b.timedSecPerQ ? 'timed' : 'tutor', b.ids, b.timedSecPerQ ? b.ids.length * b.timedSecPerQ : null)
    navigate('/exam/run')
  }

  return (
    <div className="container">
      <div className="page-head">
        <h1>Question banks</h1>
        <p className="muted">Pick a track, then a bank or a timed mock.</p>
      </div>

      <div className="stats-strip">
        <div><b>{p.attempted ? `${p.accuracy}%` : '-'}</b><span>accuracy</span></div>
        <div><b>{p.attempted}</b><span>answered</span></div>
        <div><b>{p.testsTaken}</b><span>tests done</span></div>
        <div><b>{questions.length - p.unseen}/{questions.length}</b><span>seen</span></div>
      </div>

      <div className="chip-row">
        {tracks.map((t) => (
          <button key={t} className={`chip ${track === t ? 'on' : ''}`} onClick={() => setTrack(t)}>{t}</button>
        ))}
        <span className="chip off">More tracks: later</span>
      </div>

      <div className="card card-pad track-summary">
        <div>
          <span className="badge badge-brand">{track}</span>
          <h3 style={{ margin: '10px 0 4px' }}>{track} bank</h3>
          <p className="small muted" style={{ margin: 0 }}>All content is original and awaiting clinical review.</p>
        </div>
        <div className="mini-stats">
          <div><b>{trackBanks.filter((b) => b.kind === 'qbank').length}</b><span>question banks</span></div>
          <div><b>{trackBanks.filter((b) => b.kind === 'mock').length}</b><span>mock exams</span></div>
          <div><b>{questions.length}</b><span>questions</span></div>
        </div>
      </div>

      <div className="bank-row" style={{ marginTop: 28 }}>
        <div className="seg">
          <button className={tab === 'qbank' ? 'on' : ''} onClick={() => setTab('qbank')}>Question banks</button>
          <button className={tab === 'mock' ? 'on' : ''} onClick={() => setTab('mock')}>Mock exams</button>
        </div>
        <input type="search" placeholder="Search banks" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bank-grid">
        {shown.length === 0 && <p className="muted">No banks match.</p>}
        {shown.map((b) => (
          <div className="card card-pad bank-card" key={b.id}>
            <span className={`badge ${b.kind === 'mock' ? 'badge-accent' : 'badge-brand'}`}>{b.kind === 'mock' ? 'Mock' : 'Question bank'}</span>
            <h3 style={{ margin: '12px 0 6px' }}>{b.title}</h3>
            <p className="small muted" style={{ flex: 1 }}>{b.blurb}</p>
            <div className="small faint" style={{ margin: '10px 0 14px' }}>
              {b.ids.length} questions{b.timedSecPerQ ? ` · ${Math.round((b.ids.length * b.timedSecPerQ) / 60)} min` : ''}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => start(b)}>{b.kind === 'mock' ? 'Start mock' : 'Start bank'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
