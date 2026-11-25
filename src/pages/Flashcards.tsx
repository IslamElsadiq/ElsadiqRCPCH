import { useState } from 'react'
import { getCards, reviewCard } from '../lib/store'

export default function Flashcards() {
  const [, force] = useState(0)
  const [flip, setFlip] = useState(false)
  const cards = getCards()
  const due = cards.filter((c) => c.due <= Date.now())
  const card = due[0]
  const grade = (g: 0 | 1 | 2 | 3) => { reviewCard(card.id, g); setFlip(false); force((n) => n + 1) }
  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="page-head">
        <h1>Flashcards</h1>
        <p className="muted">{cards.length} cards, {due.length} due. Spaced repetition brings back what you miss just before you forget it. Add cards from any review screen.</p>
      </div>
      {!card ? (
        <div className="card card-pad"><p className="muted" style={{ margin: 0 }}>{cards.length === 0 ? 'No cards yet. Finish a test and press "Make flashcard" on a question.' : 'All caught up. Nothing due right now.'}</p></div>
      ) : (
        <div className="card card-pad">
          <div className="badge badge-muted" style={{ marginBottom: 12 }}>{card.sourceQ}</div>
          <p className="stem-text">{card.front}</p>
          {flip ? (
            <>
              <div className="keypoint" style={{ whiteSpace: 'pre-line' }}>{card.back}</div>
              <div className="exam-nav">
                <button className="btn btn-outline" onClick={() => grade(0)}>Again</button>
                <button className="btn btn-outline" onClick={() => grade(1)}>Hard</button>
                <button className="btn btn-primary" onClick={() => grade(2)}>Good</button>
                <button className="btn btn-outline" onClick={() => grade(3)}>Easy</button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setFlip(true)}>Show answer</button>
          )}
        </div>
      )}
    </div>
  )
}
