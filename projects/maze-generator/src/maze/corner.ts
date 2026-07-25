export type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type Wall = 'top' | 'right' | 'bottom' | 'left';

export const CORNERS: Corner[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

export function getCornerCell(rows: number, cols: number, corner: Corner): { row: number; col: number } {
  switch (corner) {
    case 'top-left': return { row: 0, col: 0 };
    case 'top-right': return { row: 0, col: cols - 1 };
    case 'bottom-left': return { row: rows - 1, col: 0 };
    case 'bottom-right': return { row: rows - 1, col: cols - 1 };
  }
}

export function getCornerWall(corner: Corner): Wall {
  switch (corner) {
    case 'top-left': return 'top';
    case 'top-right': return 'top';
    case 'bottom-left': return 'left';
    case 'bottom-right': return 'bottom';
  }
}
