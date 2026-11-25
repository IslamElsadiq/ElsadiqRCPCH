export interface QuestionOption {
  label: string
  text: string
  explanation: string
  isCorrect: boolean
}

export interface Question {
  id: string
  topic: string
  subtopic: string
  difficulty: 'Easy' | 'Medium' | 'Hard' | string
  type: string
  stem: string
  options: QuestionOption[]
  keyPoint: string
  reference: string
  status: string
}

export interface Article {
  id: string
  topic: string
  title: string
  body: string
  reference: string
  linkedQuestionIds: string
  status: string
}

export type ExamMode = 'tutor' | 'timed'

export interface AnswerRecord {
  questionId: string
  chosen: string | null
  correct: boolean
  timeSpentMs: number
  flagged: boolean
}

export interface ExamSession {
  id: string
  mode: ExamMode
  questionIds: string[]
  answers: Record<string, AnswerRecord>
  current: number
  startedAt: number
  finishedAt: number | null
  timeLimitSec: number | null
}
