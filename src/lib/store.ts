import type { AnswerRecord, ExamMode, ExamSession, Question } from './types'
import { questions } from '../data/questions'

const SESSION_KEY = 'elsadiqrcph.exam'
const PROGRESS_KEY = 'elsadiqrcph.history'
const AUTH_KEY = 'elsadiqrcph.demoAuth'

export function getQuestion(id: string): Question | undefined {
  return questions.find((q) => q.id === id)
}

export function createSession(mode: ExamMode, questionIds: string[], timeLimitSec: number | null): ExamSession {
  const session: ExamSession = {
    id: `T-${Date.now()}`,
    mode,
    questionIds,
    answers: {},
    current: 0,
    startedAt: Date.now(),
    finishedAt: null,
    timeLimitSec,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function loadSession(): ExamSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as ExamSession) : null
  } catch {
    return null
  }
}

export function saveSession(s: ExamSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function recordAnswer(s: ExamSession, q: Question, chosen: string | null, timeSpentMs: number): ExamSession {
  const existing = s.answers[q.id]
  const rec: AnswerRecord = {
    questionId: q.id,
    chosen,
    correct: chosen !== null && q.options.find((o) => o.label === chosen)?.isCorrect === true,
    timeSpentMs,
    flagged: existing?.flagged ?? false,
  }
  const next = { ...s, answers: { ...s.answers, [q.id]: rec } }
  saveSession(next)
  return next
}

export function toggleFlag(s: ExamSession, questionId: string): ExamSession {
  const existing = s.answers[questionId]
  const rec: AnswerRecord = existing
    ? { ...existing, flagged: !existing.flagged }
    : { questionId, chosen: null, correct: false, timeSpentMs: 0, flagged: true }
  const next = { ...s, answers: { ...s.answers, [questionId]: rec } }
  saveSession(next)
  return next
}

export interface FinishedTest {
  id: string
  mode: ExamMode
  finishedAt: number
  total: number
  correct: number
  perSubtopic: Record<string, { attempted: number; correct: number }>
  questionIds: string[]
  answers: Record<string, AnswerRecord>
}

export function finishSession(s: ExamSession): FinishedTest {
  const finished: ExamSession = { ...s, finishedAt: Date.now() }
  saveSession(finished)
  const perSubtopic: FinishedTest['perSubtopic'] = {}
  let correct = 0
  for (const qid of s.questionIds) {
    const q = getQuestion(qid)
    const a = s.answers[qid]
    if (!q || !a || a.chosen === null) continue
    const st = perSubtopic[q.subtopic] ?? { attempted: 0, correct: 0 }
    st.attempted += 1
    if (a.correct) {
      st.correct += 1
      correct += 1
    }
    perSubtopic[q.subtopic] = st
  }
  const record: FinishedTest = {
    id: s.id,
    mode: s.mode,
    finishedAt: Date.now(),
    total: s.questionIds.length,
    correct,
    perSubtopic,
    questionIds: s.questionIds,
    answers: s.answers,
  }
  const history = getHistory()
  history.push(record)
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(history))
  return record
}

export function getHistory(): FinishedTest[] {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as FinishedTest[]) : []
  } catch {
    return []
  }
}

export interface ProgressSummary {
  attempted: number
  correct: number
  accuracy: number
  testsTaken: number
  perSubtopic: Record<string, { attempted: number; correct: number }>
  unseen: number
}

export function getProgress(): ProgressSummary {
  const history = getHistory()
  const perSubtopic: ProgressSummary['perSubtopic'] = {}
  const seen = new Set<string>()
  let correct = 0
  let attempted = 0
  for (const t of history) {
    for (const qid of t.questionIds) {
      const a = t.answers[qid]
      const q = getQuestion(qid)
      if (!a || !q || a.chosen === null) continue
      if (seen.has(qid)) continue
      seen.add(qid)
      attempted += 1
      if (a.correct) correct += 1
      const st = perSubtopic[q.subtopic] ?? { attempted: 0, correct: 0 }
      st.attempted += 1
      if (a.correct) st.correct += 1
      perSubtopic[q.subtopic] = st
    }
  }
  return {
    attempted,
    correct,
    accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
    testsTaken: history.length,
    perSubtopic,
    unseen: questions.length - seen.size,
  }
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function demoLogin() {
  localStorage.setItem(AUTH_KEY, '1')
}

export function demoLogout() {
  localStorage.removeItem(AUTH_KEY)
}

// ---------- flashcards (SM-2 style) ----------
export interface Card { id: string; front: string; back: string; due: number; interval: number; ease: number; reps: number; sourceQ?: string }
const CARDS_KEY = 'elsadiqrcph.cards'
const NOTES_KEY = 'elsadiqrcph.notes'
const ERR_KEY = 'elsadiqrcph.errors'

export function getCards(): Card[] {
  try { return JSON.parse(localStorage.getItem(CARDS_KEY) || '[]') } catch { return [] }
}
function saveCards(c: Card[]) { localStorage.setItem(CARDS_KEY, JSON.stringify(c)) }

export function makeCardFromQuestion(q: Question) {
  const cards = getCards()
  if (cards.some((c) => c.sourceQ === q.id)) return false
  const correct = q.options.find((o) => o.isCorrect)
  cards.push({
    id: `C-${q.id}`,
    front: q.stem,
    back: `${correct?.label}. ${correct?.text}\n\n${q.keyPoint}`,
    due: Date.now(), interval: 0, ease: 2.5, reps: 0, sourceQ: q.id,
  })
  saveCards(cards)
  return true
}

// grade: 0 again, 1 hard, 2 good, 3 easy
export function reviewCard(id: string, grade: 0 | 1 | 2 | 3) {
  const cards = getCards().map((c) => {
    if (c.id !== id) return c
    let { interval, ease, reps } = c
    if (grade === 0) { reps = 0; interval = 0; ease = Math.max(1.3, ease - 0.2) }
    else {
      reps += 1
      interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease)
      if (grade === 1) { ease = Math.max(1.3, ease - 0.15); interval = Math.max(1, Math.round(interval * 0.7)) }
      if (grade === 3) { ease += 0.15; interval = Math.round(interval * 1.3) }
    }
    return { ...c, reps, ease, interval, due: Date.now() + (interval === 0 ? 10 * 60 * 1000 : interval * 86400000) }
  })
  saveCards(cards)
}

// ---------- notes and error reasons ----------
export function getNotes(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}') } catch { return {} }
}
export function saveNote(qid: string, body: string) {
  const n = getNotes(); if (body.trim()) n[qid] = body; else delete n[qid]
  localStorage.setItem(NOTES_KEY, JSON.stringify(n))
}
export type ErrorReason = 'knowledge_gap' | 'misread' | 'careless' | 'guess'
export function getErrors(): Record<string, ErrorReason> {
  try { return JSON.parse(localStorage.getItem(ERR_KEY) || '{}') } catch { return {} }
}
export function tagError(qid: string, r: ErrorReason | null) {
  const e = getErrors(); if (r) e[qid] = r; else delete e[qid]
  localStorage.setItem(ERR_KEY, JSON.stringify(e))
}

// ---------- weak spots ----------
export function weakQuestionIds(limit: number): string[] {
  const wrong = new Set<string>()
  for (const t of getHistory()) for (const qid of t.questionIds) {
    const a = t.answers[qid]; if (a && a.chosen !== null && !a.correct) wrong.add(qid)
  }
  const unseen = questions.map((q) => q.id).filter((id) => !getHistory().some((t) => t.answers[id]?.chosen))
  return [...wrong, ...unseen].slice(0, limit)
}
