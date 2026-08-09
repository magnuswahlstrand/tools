// Word-level diff using LCS, similar to `git diff --word-diff`.
// Tokens are words; whitespace between them is preserved by tokenizing
// on word boundaries and keeping the whitespace attached to the output.

export type DiffType = 'same' | 'added' | 'removed' | 'gap'

export interface DiffPart {
  type: DiffType
  value: string
}

function tokenize(text: string): string[] {
  // Split into words and whitespace runs, keeping both.
  return text.split(/(\s+)/).filter((t) => t.length > 0)
}

// Compute LCS table between token arrays a and b, then backtrack into
// a list of {type: 'same' | 'added' | 'removed', value} parts.
export function diffWords(oldText: string, newText: string): DiffPart[] {
  const a = tokenize(oldText)
  const b = tokenize(newText)
  const n = a.length
  const m = b.length

  // DP table of LCS lengths. Fine for typical pasted texts.
  const lcs = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] =
        a[i] === b[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const parts: DiffPart[] = []
  const push = (type: DiffType, value: string) => {
    const last = parts[parts.length - 1]
    if (last && last.type === type) {
      last.value += value
    } else {
      parts.push({ type, value })
    }
  }

  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push('same', a[i])
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      push('removed', a[i])
      i++
    } else {
      push('added', b[j])
      j++
    }
  }
  while (i < n) push('removed', a[i++])
  while (j < m) push('added', b[j++])

  return parts
}

// Split text into sentence ranges. A sentence ends at a period, exclamation
// or question mark followed by whitespace, or at a line break. Trailing
// whitespace stays with the sentence so newlines are not orphaned.
function sentenceRanges(text: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = []
  let start = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '\n') {
      ranges.push([start, i + 1])
      start = i + 1
    } else if ((ch === '.' || ch === '!' || ch === '?') && /\s/.test(text[i + 1] ?? '')) {
      let j = i + 1
      while (j < text.length && /\s/.test(text[j])) j++
      ranges.push([start, j])
      start = j
      i = j - 1
    }
  }
  if (start < text.length) ranges.push([start, text.length])
  return ranges
}

// Collapse unchanged sections between changes, keeping `context` sentences
// as context around each change. Long unchanged runs become a single 'gap'
// part rendered as a "…" marker.
export function collapseUnchanged(parts: DiffPart[], context = 1): DiffPart[] {
  if (!parts.some((p) => p.type === 'added' || p.type === 'removed')) return parts

  const text = parts.map((p) => p.value).join('')

  // Mark every changed character.
  const changedAt = new Uint8Array(text.length)
  let pos = 0
  for (const p of parts) {
    if (p.type === 'added' || p.type === 'removed') {
      changedAt.fill(1, pos, pos + p.value.length)
    }
    pos += p.value.length
  }

  // Expand each changed sentence to include `context` sentences around it.
  const sentences = sentenceRanges(text)
  const visible = new Uint8Array(text.length)
  sentences.forEach(([s, e], i) => {
    let hasChange = false
    for (let c = s; c < e; c++) {
      if (changedAt[c]) {
        hasChange = true
        break
      }
    }
    if (!hasChange) return
    const from = Math.max(0, i - context)
    const to = Math.min(sentences.length - 1, i + context)
    for (let k = from; k <= to; k++) {
      const [a, b] = sentences[k]
      for (let c = a; c < b; c++) visible[c] = 1
    }
  })

  // Group visible characters into contiguous hunks.
  const hunks: Array<[number, number]> = []
  let start = -1
  for (let c = 0; c <= text.length; c++) {
    const leaf = c < text.length ? visible[c] : 0
    if (leaf) {
      if (start < 0) start = c
    } else if (start >= 0) {
      hunks.push([start, c])
      start = -1
    }
  }

  // Render only the hunks, clipping parts and inserting "…" gaps. A gap is
  // inserted when content before, between or after the hunks is collapsed.
  const out: DiffPart[] = []
  for (let h = 0; h < hunks.length; h++) {
    const [hs, he] = hunks[h]
    if (h > 0 || hs > 0) out.push({ type: 'gap', value: '\n…\n' })
    let pPos = 0
    for (const p of parts) {
      const pStart = pPos
      const pEnd = pStart + p.value.length
      pPos = pEnd
      if (pEnd <= hs || pStart >= he) continue
      const value = p.value.slice(Math.max(pStart, hs) - pStart, Math.min(pEnd, he) - pStart)
      const last = out[out.length - 1]
      if (last && last.type === p.type && last.type !== 'gap') {
        last.value += value
      } else {
        out.push({ type: p.type, value })
      }
    }
  }
  const lastHunk = hunks[hunks.length - 1]
  if (lastHunk && lastHunk[1] < text.length) out.push({ type: 'gap', value: '\n…\n' })
  return out
}