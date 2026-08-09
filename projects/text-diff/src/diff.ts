// Word-level diff using LCS, similar to `git diff --word-diff`.
// Tokens are words; whitespace between them is preserved by tokenizing
// on word boundaries and keeping the whitespace attached to the output.

export type DiffType = 'same' | 'added' | 'removed'

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