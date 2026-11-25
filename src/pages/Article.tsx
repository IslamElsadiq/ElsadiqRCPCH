import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'
import { articles } from '../data/articles'

export default function Article() {
  const { id } = useParams()
  const article = articles.find((a) => a.id === id) ?? articles[0]
  const html = useMemo(() => marked.parse(article.body, { async: false }), [article])

  return (
    <div className="container">
      <div className="page-head" style={{ maxWidth: 720 }}>
        <div className="q-meta" style={{ marginBottom: 10 }}>
          <span className="badge badge-brand">Library</span>
          <span className="badge badge-muted">{article.topic}</span>
          <span className="badge badge-accent">Draft · needs clinical review</span>
        </div>
      </div>
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
      <div className="card card-pad" style={{ maxWidth: 720, marginTop: 36 }}>
        <b>Linked questions</b>
        <p className="muted small" style={{ margin: '6px 0 14px' }}>
          This explainer is linked to the neonatal jaundice batch ({article.linkedQuestionIds}).
        </p>
        <Link to="/exam" className="btn btn-primary btn-sm">Test yourself on this topic</Link>
      </div>
    </div>
  )
}
