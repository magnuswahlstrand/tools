import { Grid } from './grid';
import { getCornerCell, getCornerWall, CORNERS, type Corner } from './corner';

function createRng(seed?: number): () => number {
  if (seed === undefined) return Math.random;
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateMaze(
  rows: number,
  cols: number,
  seed?: number,
): { grid: Grid; startCorner: Corner; finishCorner: Corner } {
  const grid = new Grid(rows, cols);
  const rng = createRng(seed);

  function carve(row: number, col: number): void {
    const cell = grid.getCell(row, col)!;
    cell.visited = true;
    const neighbors = shuffle(grid.getUnvisitedNeighbors(cell), rng);
    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        grid.removeWall(cell, neighbor);
        carve(neighbor.row, neighbor.col);
      }
    }
  }

  carve(0, 0);

  const shuffled = shuffle([...CORNERS], rng);
  const sc = shuffled[0];
  const fc = shuffled[1];

  const startCell = getCornerCell(rows, cols, sc);
  const finishCell = getCornerCell(rows, cols, fc);

  grid.cells[startCell.row][startCell.col].walls[getCornerWall(sc)] = false;
  grid.cells[finishCell.row][finishCell.col].walls[getCornerWall(fc)] = false;

  for (const cell of grid.getAllCells()) {
    cell.visited = false;
  }

  return { grid, startCorner: sc, finishCorner: fc };
}
