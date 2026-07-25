import { Grid } from './grid';

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

export function generateMaze(rows: number, cols: number, seed?: number): Grid {
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

  grid.cells[0][0].walls.top = false;
  grid.cells[rows - 1][cols - 1].walls.bottom = false;

  for (const cell of grid.getAllCells()) {
    cell.visited = false;
  }

  return grid;
}
