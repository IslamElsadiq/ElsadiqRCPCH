import { supabase, isDemo } from './supabase'
import { fetchQuestions, finishTest, submitAnswer, type RemoteQuestion, type SubmitResult } from './api'

export const useRemote = !isDemo
const KEY = 'elsadiqrcph.remote'
const LAST_KEY = 'elsadiqrcph.remote.last'

export interface RemoteSession {
  testId: string
  mode: 'tutor' | 'timed'
  questionIds: string[]
  current: number
  startedAt: number
  timeLimitSec: number | null
  picks: Record<string, { optionId: string; label: string }>
  results: Record<string, SubmitResult>
  flagged: Record<string, boolean>
  finished: boolean
  summary?: { total: number; correct: number }
}

export function loadRemote(): RemoteSession | null {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}
export function saveRemote(s: RemoteSession) { localStorage.setItem(KEY, JSON.stringify(s)) }
export function loadLast(): RemoteSession | null {
  try { return JSON.parse(localStorage.getItem(LAST_KEY) || 'null') } catch { return null }
}
export function saveLast(s: RemoteSession) { localStorage.setItem(LAST_KEY, JSON.stringify(s)) }

function fresh(testId: string, mode: 'tutor' | 'timed', ids: string[], limit: number | null): RemoteSession {
  return { testId, mode, questionIds: ids, current: 0, startedAt: Date.now(), timeLimitSec: limit, picks: {}, results: {}, flagged: {}, finished: false }
}

export interface CreateOpts {
  mode: 'tutor' | 'timed'
  count?: number
  topicIds?: number[]
  onlyWrong?: boolean
  unseenOnly?: boolean
  timeLimitSec?: number | null
}

// published questions, server picks and shuffles
export async function createTest(o: CreateOpts): Promise<RemoteSession> {
  const { data, error } = await supabase!.rpc('create_test', {
    p_mode: o.mode,
    p_count: o.count ?? 20,
    p_topic_ids: o.topicIds ?? null,
    p_subject_ids: null,
    p_only_wrong: o.onlyWrong ?? false,
    p_unseen_only: o.unseenOnly ?? false,
    p_time_limit_sec: o.timeLimitSec ?? null,
  })
  if (error) throw error
  const testId = data as string
  const { data: tq, error: e2 } = await supabase!.from('test_questions').select('question_id, position').eq('test_id', testId).order('position')
  if (e2) throw e2
  const s = fresh(testId, o.mode, (tq ?? []).map((r: any) => r.question_id), o.timeLimitSec ?? null)
  saveRemote(s)
  return s
}

// staff only: a test over draft questions the server will not pick itself (RLS still applies)
export async function createDraftTest(ids: string[], mode: 'tutor' | 'timed', timeLimitSec: number | null): Promise<RemoteSession> {
  const { data: t, error } = await supabase!.from('tests').insert({ mode, time_limit_sec: timeLimitSec }).select('id').single()
  if (error) throw error
  const rows = ids.map((question_id, i) => ({ test_id: t.id, question_id, position: i + 1 }))
  const { error: e2 } = await supabase!.from('test_questions').insert(rows)
  if (e2) throw e2
  const s = fresh(t.id, mode, ids, timeLimitSec)
  saveRemote(s)
  return s
}

export async function questionsByIds(ids: string[]): Promise<RemoteQuestion[]> {
  if (!ids.length) return []
  const { data, error } = await supabase!
    .from('questions')
    .select('id, code, stem, difficulty, status, topic_id, options(id, label, body)')
    .in('id', ids)
  if (error) throw error
  const map = new Map((data ?? []).map((q: any) => [q.id, { ...q, options: [...(q.options ?? [])].sort((a: any, b: any) => a.label.localeCompare(b.label)) }]))
  return ids.map((id) => map.get(id)).filter(Boolean) as RemoteQuestion[]
}

export async function pick(s: RemoteSession, q: RemoteQuestion, label: string, timeMs: number): Promise<RemoteSession> {
  const opt = q.options.find((o) => o.label === label)!
  const next: RemoteSession = { ...s, picks: { ...s.picks, [q.id]: { optionId: opt.id, label } } }
  if (s.mode === 'tutor') {
    next.results = { ...s.results, [q.id]: await submitAnswer(s.testId, q.id, opt.id, timeMs) }
  }
  saveRemote(next)
  return next
}

// timed tests: answers go to the server once, at the end
export async function finishRemote(s: RemoteSession): Promise<RemoteSession> {
  const results = { ...s.results }
  if (s.mode === 'timed') {
    for (const qid of s.questionIds) {
      const p = s.picks[qid]
      if (p && !results[qid]) results[qid] = await submitAnswer(s.testId, qid, p.optionId, 0)
    }
  }
  const summary = await finishTest(s.testId)
  const done: RemoteSession = { ...s, results, finished: true, summary }
  saveLast(done)
  localStorage.removeItem(KEY)
  return done
}

export interface RemoteProgress {
  attempted: number; correct: number; accuracy: number; tests: number
  byTopic: { name: string; attempted: number; correct: number }[]
  recent: { id: string; mode: string; at: string; correct: number; total: number }[]
}

export async function fetchProgress(): Promise<RemoteProgress> {
  const sb = supabase!
  const { data: stats } = await sb.from('user_topic_stats').select('attempted, correct, topics(name)')
  const byTopic = (stats ?? []).map((r: any) => ({ name: r.topics?.name ?? 'Topic', attempted: r.attempted, correct: r.correct }))
  const attempted = byTopic.reduce((a, b) => a + b.attempted, 0)
  const correct = byTopic.reduce((a, b) => a + b.correct, 0)
  const { data: tests } = await sb.from('tests').select('id, mode, finished_at').not('finished_at', 'is', null).order('finished_at', { ascending: false }).limit(5)
  const ids = (tests ?? []).map((t: any) => t.id)
  const { data: ans } = ids.length ? await sb.from('answers').select('test_id, is_correct').in('test_id', ids) : { data: [] as any[] }
  const recent = (tests ?? []).map((t: any) => {
    const a = (ans ?? []).filter((x: any) => x.test_id === t.id)
    return { id: t.id, mode: t.mode, at: t.finished_at, correct: a.filter((x: any) => x.is_correct).length, total: a.length }
  })
  const { count } = await sb.from('tests').select('id', { count: 'exact', head: true }).not('finished_at', 'is', null)
  return { attempted, correct, accuracy: attempted ? Math.round((correct / attempted) * 100) : 0, tests: count ?? 0, byTopic, recent }
}

export async function reviewKeys(testId: string): Promise<Record<string, SubmitResult> | null> {
  // server function: only returns rows for finished tests of the caller
  const { data, error } = await supabase!.rpc('review_test', { p_test: testId })
  if (error || !Array.isArray(data)) return null
  const out: Record<string, SubmitResult> = {}
  for (const r of data as any[]) {
    out[r.question_id] = {
      is_correct: !!r.is_correct,
      options: (r.options ?? []).map((o: any) => ({ label: o.label, is_correct: !!o.is_correct, explanation: o.explanation ?? '' })),
      key_point: r.key_point ?? '',
      reference: r.reference ?? '',
    } as SubmitResult
  }
  return out
}

export async function answerRows(testId: string) {
  const { data } = await supabase!.from('answers').select('question_id, option_id, is_correct').eq('test_id', testId)
  return (data ?? []) as { question_id: string; option_id: string; is_correct: boolean }[]
}

export { fetchQuestions }
