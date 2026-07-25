import { Cell } from './grid';
import { Grid } from './grid';

export interface LetterPlacement {
  cell: Cell;
  letter: string;
  isCorrect: boolean;
}

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function countOpenWalls(cell: Cell): number {
  let count = 0;
  if (!cell.walls.top) count++;
  if (!cell.walls.right) count++;
  if (!cell.walls.bottom) count++;
  if (!cell.walls.left) count++;
  return count;
}

function shuffleArray<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function placeLetters(
  grid: Grid,
  solutionPath: Cell[],
  word: string,
  decoyEnabled: boolean,
  decoyChars?: string,
): LetterPlacement[] {
  const placements: LetterPlacement[] = [];
  const usedKeys = new Set<string>();

  if (solutionPath.length === 0 || word.length === 0) return placements;

  const gap = Math.max(2, Math.floor(solutionPath.length / word.length));
  for (let i = 0; i < word.length; i++) {
    const idx = Math.min(i * gap, solutionPath.length - 1);
    const cell = solutionPath[idx];
    placements.push({ cell, letter: word[i].toUpperCase(), isCorrect: true });
    usedKeys.add(cellKey(cell));
  }

  if (decoyEnabled) {
    const solutionSet = new Set(solutionPath.map(cellKey));
    const allCells = grid.getAllCells();
    const deadEnds = allCells.filter(
      (c) => !solutionSet.has(cellKey(c)) && countOpenWalls(c) === 1,
    );

    const pool = decoyChars
      ? decoyChars.toUpperCase().split('').filter((c) => /[A-Z]/.test(c))
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const decoyLetters = pool.length > 0 ? shuffleArray(pool) : shuffleArray('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
    let di = 0;
    for (const cell of deadEnds) {
      if (!usedKeys.has(cellKey(cell))) {
        placements.push({
          cell,
          letter: decoyLetters[di % decoyLetters.length],
          isCorrect: false,
        });
        usedKeys.add(cellKey(cell));
        di++;
      }
    }
  }

  return placements;
}
