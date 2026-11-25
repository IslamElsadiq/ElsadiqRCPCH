import { supabase } from './supabase'

// Remote data access. Every call relies on Row Level Security on the server;
// the browser only ever holds the publishable key.

export interface RemoteOption { id: string; label: string; body: string }
export interface RemoteQuestion {
  id: string
  code: string | null
  stem: string
  difficulty: number | null
  status: string
  topic_id: number | null
  options: RemoteOption[]
}

export async function fetchQuestions(): Promise<RemoteQuestion[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('questions')
    .select('id, code, stem, difficulty, status, topic_id, options(id, label, body)')
    .order('code')
  if (error) throw error
  return (data ?? []).map((q: any) => ({
    ...q,
    options: [...(q.options ?? [])].sort((a: RemoteOption, b: RemoteOption) => a.label.localeCompare(b.label)),
  }))
}

export interface SubmitResult {
  is_correct?: boolean
  recorded?: boolean
  key_point?: string
  reference?: string
  options?: { label: string; is_correct: boolean; explanation: string }[]
}

export async function submitAnswer(testId: string, questionId: string, optionId: string, timeMs: number): Promise<SubmitResult> {
  const { data, error } = await supabase!.rpc('submit_answer', {
    p_test: testId, p_question: questionId, p_option: optionId, p_time_ms: timeMs,
  })
  if (error) throw error
  return data as SubmitResult
}

export async function finishTest(testId: string): Promise<{ total: number; correct: number }> {
  const { data, error } = await supabase!.rpc('finish_test', { p_test: testId })
  if (error) throw error
  return data as { total: number; correct: number }
}
