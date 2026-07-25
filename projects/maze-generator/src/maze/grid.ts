export interface Cell {
  row: number;
  col: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export class Grid {
  cells: Cell[][];
  rows: number;
  cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.cells = [];
    for (let r = 0; r < rows; r++) {
      this.cells[r] = [];
      for (let c = 0; c < cols; c++) {
        this.cells[r][c] = {
          row: r,
          col: c,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false,
        };
      }
    }
  }

  getCell(row: number, col: number): Cell | undefined {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return undefined;
    return this.cells[row][col];
  }

  getUnvisitedNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];
    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 0, dc: 1 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
    ];
    for (const { dr, dc } of dirs) {
      const n = this.getCell(cell.row + dr, cell.col + dc);
      if (n && !n.visited) neighbors.push(n);
    }
    return neighbors;
  }

  removeWall(a: Cell, b: Cell): void {
    const dr = b.row - a.row;
    const dc = b.col - a.col;
    if (dr === -1) { a.walls.top = false; b.walls.bottom = false; }
    if (dr === 1) { a.walls.bottom = false; b.walls.top = false; }
    if (dc === -1) { a.walls.left = false; b.walls.right = false; }
    if (dc === 1) { a.walls.right = false; b.walls.left = false; }
  }

  getAllCells(): Cell[] {
    const all: Cell[] = [];
    for (const row of this.cells) {
      for (const cell of row) {
        all.push(cell);
      }
    }
    return all;
  }
}
