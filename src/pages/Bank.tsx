import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { questions } from '../data/questions'

const subtopics = [...new Set(questions.map((q) => q.subtopic))]
const difficulties = [...new Set(questions.map((q) => q.difficulty))]

export default function Bank() {
  const [search, setSearch] = useState('')
  const [subtopic, setSubtopic] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  const filtered = useMemo(
    () =>
      questions.filter(
        (q) =>
          (subtopic === 'all' || q.subtopic === subtopic) &&
          (difficulty === 'all' || q.difficulty === difficulty) &&
          (!search || q.stem.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase())),
      ),
    [search, subtopic, difficulty],
  )

  return (
    <div className="container">
      <div className="page-head">
        <h1>Question bank</h1>
        <p className="muted">
          {questions.length} original single-best-answer questions on the MRCPCH track. Draft status: every item is
          awaiting clinical review before publication.
        </p>
      </div>
      <div className="bank-row">
        <input type="search" placeholder="Search stems or question IDs…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={subtopic} onChange={(e) => setSubtopic(e.target.value)}>
          <option value="all">All subtopics</option>
          {subtopics.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="all">All difficulties</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <p className="small faint">{filtered.length} of {questions.length} questions</p>
      {filtered.map((q) => (
        <Link to={`/exam?q=${q.id}`} className="card q-item" key={q.id}>
          <div className="q-meta">
            <span className="badge badge-muted">{q.id}</span>
            <span className="badge badge-brand">{q.subtopic}</span>
            <span className={`badge ${q.difficulty === 'Easy' ? 'badge-ok' : q.difficulty === 'Hard' ? 'badge-danger' : 'badge-accent'}`}>{q.difficulty}</span>
            <span className="badge badge-muted">SBA</span>
          </div>
          <div className="stem">{q.stem}</div>
          <div className="small faint">{q.options.length} options · explanation per option · key point · reference</div>
        </Link>
      ))}
    </div>
  )
}
