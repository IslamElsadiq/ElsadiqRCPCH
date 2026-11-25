import { Link } from 'react-router-dom'
import { questions } from '../data/questions'

const features = [
  {
    title: 'Tutor mode',
    body: 'Answer a question and immediately see why every option is right or wrong, with a key learning point and reference.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    ),
  },
  {
    title: 'Timed exam mode',
    body: 'Sit a realistic timed paper. No feedback until you finish, then a full review with per-option explanations.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5"/><path d="M9 2h6"/></svg>
    ),
  },
  {
    title: 'Progress tracking',
    body: 'Accuracy by topic, weak-area detection and a full history of every test, so revision goes where it matters.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-6 4 3 5-8"/></svg>
    ),
  },
  {
    title: 'Explanations per option',
    body: 'Not just the correct answer: each distractor carries its own teaching point, the way a good examiner thinks.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/></svg>
    ),
  },
  {
    title: 'Reference library',
    body: 'Exam-focused articles linked to each question batch, written from current national guidance.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/></svg>
    ),
  },
  {
    title: 'Original content',
    body: 'Every question is written from scratch for this bank. Nothing is copied from commercial providers.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    ),
  },
]

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span className="badge badge-brand">MRCPCH track</span>
              <span className="badge badge-muted">Free, original question bank</span>
            </div>
            <h1>
              Revise for the <em>MRCPCH</em> with questions that teach.
            </h1>
            <p className="lede">
              ElsadiqRCPCH is an independent question bank for paediatric membership revision. Every single-best-answer
              question carries an explanation for each option, a key learning point and its reference, written from
              current UK guidance.
            </p>
            <div className="hero-cta">
              <Link to="/exam" className="btn btn-primary">Start a test</Link>
              <Link to="/bank" className="btn btn-outline">Browse the bank</Link>
            </div>
            <div className="stats-row" style={{ marginTop: 44 }}>
              <div className="stat"><b>{questions.length}</b><span>SBA questions live</span></div>
              <div className="stat"><b>5</b><span>explanations per question</span></div>
              <div className="stat"><b>1</b><span>reference article</span></div>
            </div>
          </div>
          <div className="hero-panel">
            <div className="card card-pad">
              <div className="q-meta" style={{ marginBottom: 10 }}>
                <span className="badge badge-brand">Neonatal jaundice</span>
                <span className="badge badge-muted">Assessment</span>
                <span className="badge badge-accent">Easy</span>
              </div>
              <p className="stem-text" style={{ fontSize: 16.5, marginBottom: 16 }}>
                A term baby is noticed to be jaundiced at 14 hours of age. She is feeding well and examination is
                otherwise normal. What is the most appropriate next step?
              </p>
              {['Reassure the mother that this is physiological jaundice', 'Measure transcutaneous bilirubin and repeat in 12 hours', 'Measure serum bilirubin urgently (within 2 hours)'].map((t, i) => (
                <div key={i} className={`option ${i === 2 ? 'correct' : ''}`} style={{ pointerEvents: 'none', padding: '12px 15px' }}>
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontSize: 14.5 }}>{t}</span>
                </div>
              ))}
              <div className="keypoint" style={{ marginTop: 16 }}>
                <b>Key point:</b> Jaundice in the first 24 hours is pathological: serum bilirubin within 2 hours.
              </div>
            </div>
            <div className="float-chip" style={{ top: -16, right: 18 }}>Tutor mode: instant feedback</div>
            <div className="float-chip" style={{ bottom: -14, left: 12 }}>Reference: NICE CG98</div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-soft)' }}>
        <div className="container">
          <h2 className="section-title">Built for how you actually revise</h2>
          <p className="section-sub">
            Two study modes, honest analytics and content you can trust, because it is written from the guideline,
            not scraped from other banks.
          </p>
          <div className="feature-grid">
            {features.map((f) => (
              <div className="card feature" key={f.title}>
                <div className="icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Start with the neonatal jaundice batch</h2>
          <p className="section-sub" style={{ margin: '0 auto 28px' }}>
            Twenty original SBAs on assessment, causes, phototherapy, prolonged jaundice and complications,
            linked to an exam-focused explainer.
          </p>
          <Link to="/exam" className="btn btn-primary">Take the 20-question test</Link>
        </div>
      </section>
    </>
  )
}
