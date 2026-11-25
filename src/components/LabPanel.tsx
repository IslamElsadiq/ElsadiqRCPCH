const ROWS: [string, string][] = [
  ['Haemoglobin, term newborn', '135 to 195 g/L'],
  ['Haemoglobin, 1 to 2 years', '105 to 135 g/L'],
  ['White cell count, 1 to 3 years', '6 to 17 x10^9/L'],
  ['Platelets (all ages beyond newborn)', '150 to 450 x10^9/L'],
  ['Sodium', '135 to 145 mmol/L'],
  ['Potassium, child', '3.5 to 5.0 mmol/L'],
  ['Glucose, fasting', '3.5 to 5.5 mmol/L'],
  ['Calcium, total', '2.2 to 2.7 mmol/L'],
  ['Creatinine, 1 to 5 years', '15 to 35 micromol/L'],
  ['pH, arterial', '7.35 to 7.45'],
  ['Bicarbonate', '22 to 26 mmol/L'],
  ['Total bilirubin, newborn: treat by gestation-specific chart', 'See NICE NG98 thresholds'],
]
export default function LabPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="slide-over" role="dialog" aria-label="Reference values">
      <div className="slide-head"><b>Reference values</b><button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button></div>
      <p className="small muted">Approximate paediatric ranges for study. Draft pending the editor's clinical review. Labs differ, so always check local ranges.</p>
      <table className="lab-table"><tbody>{ROWS.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>)}</tbody></table>
    </div>
  )
}
