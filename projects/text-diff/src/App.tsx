import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { collapseUnchanged, diffWords, type DiffType } from './diff'

const SAMPLE_OLD = `The quick brown fox jumps over the lazy dog.
It was a sunny day in the forest and everyone enjoyed the warm weather.
The birds were singing, the flowers were blooming, and the bees were busy.
After a long walk by the lake, they all returned home for a big dinner.
The next morning, the sun rose again and the village came back to life.
Everyone met at the market square to share stories from the previous day.
The children played happily while the adults drank coffee and talked.
By noon, the festival was in full swing and music filled the air.
The old man finally arrived and the whole town cheered loudly.`

const SAMPLE_NEW = `The quick red fox leaps over the lazy dog.
It was a rainy day in the forest and everyone enjoyed the warm weather.
The birds were singing, the flowers were blooming, and the bees were busy.
After a long walk by the lake, they all returned home for a big dinner.
The next morning, the sun rose again and the village came back to life.
Everyone met at the market square to share stories from the previous day.
The children played happily while the adults drank coffee and talked.
By noon, the festival was in full swing and music filled the air.
The old man quietly stepped aside and the whole town cheered loudly.`

export default function App() {
  const [oldText, setOldText] = useState<string>(SAMPLE_OLD)
  const [newText, setNewText] = useState<string>(SAMPLE_NEW)
  const [context, setContext] = useState<number>(1)

  const parts = useMemo(() => diffWords(oldText, newText), [oldText, newText])
  const hasDiff = parts.some((p) => p.type === 'added' || p.type === 'removed')
  const contextParts = useMemo(() => collapseUnchanged(parts, context), [parts, context])
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
        <span className="controls">
          <label htmlFor="context">Context sentences</label>
          <input
            id="context"
            type="number"
            min={0}
            max={10}
            value={context}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setContext(Math.max(0, Math.min(10, Number(e.target.value) || 0)))
            }
          />
          <span className="stats">
            <span className="stat-added">+{stats.added}</span>{' '}
            <span className="stat-removed">−{stats.removed}</span> words
          </span>
        </span>
      </div>
      {hasDiff ? (
        <pre className="diff-output">
          {contextParts.map((part, idx) =>
            part.type === 'same' ? (
              <span key={idx}>{part.value}</span>
            ) : (
              <span key={idx} className={part.type}>
                {part.value}
              </span>
            ),
          )}
        </pre>
      ) : (
        <p className="no-diff">No differences</p>
      )}
    </div>
  )
}