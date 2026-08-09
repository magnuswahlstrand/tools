import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { diffWords, type DiffType } from './diff'

const SAMPLE_OLD = `The quick brown fox jumps over the lazy dog.
It was a sunny day in the forest.`

const SAMPLE_NEW = `The quick red fox leaps over the lazy dog.
It was a rainy day in the deep forest.`

export default function App() {
  const [oldText, setOldText] = useState<string>(SAMPLE_OLD)
  const [newText, setNewText] = useState<string>(SAMPLE_NEW)

  const parts = useMemo(() => diffWords(oldText, newText), [oldText, newText])
  const stats = useMemo(() => {
    const count = (type: DiffType) =>
      parts
        .filter((p) => p.type === type)
        .reduce((sum, p) => sum + (p.value.trim() ? p.value.trim().split(/\s+/).length : 0), 0)
    return { added: count('added'), removed: count('removed') }
  }, [parts])

  return (
    <div className="app">
      <h1>Text diff</h1>
      <p className="hint">Word-for-word diff, like <code>git diff --word-diff</code>.</p>
      <div className="inputs">
        <label>
          <span>Original</span>
          <textarea
            value={oldText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setOldText(e.target.value)}
            spellCheck={false}
          />
        </label>
        <label>
          <span>Changed</span>
          <textarea
            value={newText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewText(e.target.value)}
            spellCheck={false}
          />
        </label>
      </div>
      <div className="result-header">
        <h2>Diff</h2>
        <span className="stats">
          <span className="stat-added">+{stats.added}</span>{' '}
          <span className="stat-removed">−{stats.removed}</span> words
        </span>
      </div>
      <pre className="diff-output">
        {parts.map((part, idx) =>
          part.type === 'same' ? (
            <span key={idx}>{part.value}</span>
          ) : (
            <span key={idx} className={part.type}>
              {part.value}
            </span>
          ),
        )}
      </pre>
    </div>
  )
}