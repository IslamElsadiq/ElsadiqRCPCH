import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ReportError({ questionId, code }: { questionId: string; code?: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  async function send() {
    if (!supabase || reason.trim().length < 3) return
    setState('busy')
    const { error } = await supabase.from('question_reports').insert({ question_id: questionId, reason: reason.trim() })
    setState(error ? 'error' : 'done')
  }
  if (state === 'done') return <span className="small muted">Report sent. Thank you.</span>
  return (
    <span className="report-wrap">
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)}>Report error{code ? ` (${code})` : ''}</button>
      {open && (
        <div className="report-pop card card-pad">
          <label className="small">What is wrong with {code ?? 'this question'}?</label>
          <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Wrong answer, unclear stem, typo, outdated guidance…" />
          {state === 'error' && <p className="small" style={{ color: 'var(--danger)' }}>Could not send. Try again.</p>}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={send} disabled={state === 'busy'}>{state === 'busy' ? 'Sending…' : 'Send report'}</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </span>
  )
}
