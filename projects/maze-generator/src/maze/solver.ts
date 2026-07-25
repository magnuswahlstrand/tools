import { Grid, Cell } from './grid';

function cellKey(cell: Cell): string {
  return `${cell.row},${cell.col}`;
}

function getAccessibleNeighbors(grid: Grid, cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  if (!cell.walls.top) {
    const n = grid.getCell(cell.row - 1, cell.col);
    if (n) neighbors.push(n);
  }
  if (!cell.walls.right) {
    const n = grid.getCell(cell.row, cell.col + 1);
    if (n) neighbors.push(n);
  }
  if (!cell.walls.bottom) {
    const n = grid.getCell(cell.row + 1, cell.col);
    if (n) neighbors.push(n);
  }
  if (!cell.walls.left) {
    const n = grid.getCell(cell.row, cell.col - 1);
    if (n) neighbors.push(n);
  }
  return neighbors;
}

export function solveMaze(grid: Grid): Cell[] {
  const start = grid.getCell(0, 0)!;
  const end = grid.getCell(grid.rows - 1, grid.cols - 1)!;

  const visited = new Set<string>();
  const path: Cell[] = [];

  function dfs(cell: Cell): boolean {
    const key = cellKey(cell);
    if (visited.has(key)) return false;
    visited.add(key);
    path.push(cell);

    if (cell === end) return true;

    for (const neighbor of getAccessibleNeighbors(grid, cell)) {
      if (dfs(neighbor)) return true;
    }

    path.pop();
    return false;
  }

  dfs(start);
  return path;
}
