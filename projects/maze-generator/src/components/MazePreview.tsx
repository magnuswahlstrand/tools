import { useRef, useCallback, type JSX } from 'react';
import type { Cell } from '../maze/grid';
import type { Grid } from '../maze/grid';
import type { LetterPlacement } from '../maze/letters';

interface MazeItem {
  word: string;
  grid: Grid;
  solutionPath: Cell[];
  letterPlacements: LetterPlacement[];
}

interface MazePreviewProps {
  mazes: MazeItem[];
  config: {
    decoyLetters: boolean;
    drawingArea: boolean;
    landscape: boolean;
  };
}

const MARGIN_X = 22;
const MARGIN_TOP = 18;
const MARGIN_BOTTOM = 18;
const GAP = 10;
const DRAWING_H = 40;
const WALL_THICKNESS = 1;
const FONT_SIZE = 5;
const MAZES_PER_PAGE = 2;

function renderMazeContent(
  grid: Grid,
  letterPlacements: LetterPlacement[],
  mazeX: number,
  mazeY: number,
  cellSize: number,
) {
  return (
    <g transform={`translate(${mazeX}, ${mazeY})`}>
      {letterPlacements.map((lp, i) => (
        <text
          key={i}
          x={(lp.cell.col + 0.5) * cellSize}
          y={(lp.cell.row + 0.5) * cellSize + FONT_SIZE * 0.35}
          textAnchor="middle"
          fontFamily="sans-serif"
          fontSize={FONT_SIZE}
          fill="black"
        >
          {lp.letter}
        </text>
      ))}

      {grid.cells.flatMap((row) =>
        row.map((cell) => {
          const elements: JSX.Element[] = [];
          if (cell.walls.right) {
            elements.push(
              <line
                key={`r-${cell.row}-${cell.col}`}
                x1={(cell.col + 1) * cellSize}
                y1={cell.row * cellSize}
                x2={(cell.col + 1) * cellSize}
                y2={(cell.row + 1) * cellSize}
                stroke="black"
                strokeWidth={WALL_THICKNESS}
                strokeLinecap="square"
              />,
            );
          }
          if (cell.walls.bottom) {
            elements.push(
              <line
                key={`b-${cell.row}-${cell.col}`}
                x1={cell.col * cellSize}
                y1={(cell.row + 1) * cellSize}
                x2={(cell.col + 1) * cellSize}
                y2={(cell.row + 1) * cellSize}
                stroke="black"
                strokeWidth={WALL_THICKNESS}
                strokeLinecap="square"
              />,
            );
          }
          return elements;
        }),
      )}

      {grid.cells[0].map(
        (cell) =>
          cell.walls.top && (
            <line
              key={`t-${cell.col}`}
              x1={cell.col * cellSize}
              y1={0}
              x2={(cell.col + 1) * cellSize}
              y2={0}
              stroke="black"
              strokeWidth={WALL_THICKNESS}
              strokeLinecap="square"
            />
          ),
      )}

      {grid.cells.map(
        (row) =>
          row[0].walls.left && (
            <line
              key={`l-${row[0].row}`}
              x1={0}
              y1={row[0].row * cellSize}
              x2={0}
              y2={(row[0].row + 1) * cellSize}
              stroke="black"
              strokeWidth={WALL_THICKNESS}
              strokeLinecap="square"
            />
          ),
      )}
    </g>
  );
}

function renderPageSVG(
  pageMazes: MazeItem[],
  drawingArea: boolean,
  landscape: boolean,
  pageIndex: number,
) {
  const pageW = landscape ? 297 : 210;
  const pageH = landscape ? 210 : 297;

  const slotW = landscape
    ? (pageW - 2 * MARGIN_X - GAP) / MAZES_PER_PAGE
    : pageW - 2 * MARGIN_X;
  const slotH = landscape
    ? pageH - MARGIN_TOP - MARGIN_BOTTOM
    : (pageH - MARGIN_TOP - MARGIN_BOTTOM - GAP) / MAZES_PER_PAGE;

  const mazeAreaW = landscape && drawingArea ? slotW : slotW;
  const mazeAreaH = drawingArea ? slotH - DRAWING_H : slotH;

  return (
    <svg
      key={pageIndex}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${pageW} ${pageH}`}
      width="100%"
      style={{ maxWidth: landscape ? '297mm' : '210mm', display: 'block' }}
      className="maze-svg"
    >
      <rect width={pageW} height={pageH} fill="white" />

      {pageMazes.map((m, i) => {
        const cellSize = Math.min(mazeAreaW / m.grid.cols, mazeAreaH / m.grid.rows);
        const mazeW = cellSize * m.grid.cols;
        const mazeH = cellSize * m.grid.rows;

        let mazeX: number, mazeY: number;
        if (landscape) {
          mazeX = MARGIN_X + i * (slotW + GAP) + (slotW - mazeW) / 2;
          mazeY = MARGIN_TOP + (slotH - mazeH) / 2;
        } else {
          mazeX = MARGIN_X + (slotW - mazeW) / 2;
          mazeY = MARGIN_TOP + i * (slotH + GAP) + (slotH - mazeH) / 2;
        }

        const startX = mazeX + cellSize / 2;
        const startY = mazeY;
        const finishX = mazeX + (m.grid.cols - 0.5) * cellSize;
        const finishY = mazeY + m.grid.rows * cellSize;

        return (
          <g key={i}>
            <path
              d={`M ${startX - 3} ${startY - 4} L ${startX + 3} ${startY - 4} L ${startX} ${startY + 1.5} Z`}
              fill="#555"
            />
            <circle cx={finishX} cy={finishY + 4} r={3} fill="none" stroke="#555" strokeWidth={1.3} />
            <circle cx={finishX} cy={finishY + 4} r={1} fill="#555" />

            {renderMazeContent(m.grid, m.letterPlacements, mazeX, mazeY, cellSize)}

            {drawingArea && (
              <rect
                x={landscape ? (MARGIN_X + i * (slotW + GAP)) : MARGIN_X}
                y={landscape ? (MARGIN_TOP + slotH - DRAWING_H + 4) : (MARGIN_TOP + i * (slotH + GAP) + slotH - DRAWING_H + 4)}
                width={slotW}
                height={DRAWING_H - 6}
                fill="none"
                stroke="#ccc"
                strokeWidth={0.5}
                strokeDasharray="3,3"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function groupMazes(mazes: MazeItem[]): MazeItem[][] {
  const pages: MazeItem[][] = [];
  for (let i = 0; i < mazes.length; i += MAZES_PER_PAGE) {
    pages.push(mazes.slice(i, i + MAZES_PER_PAGE));
  }
  return pages;
}

export function MazePreview({ mazes, config }: MazePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const landscape = config.landscape;

  const handleDownload = useCallback(() => {
    const svgElements = containerRef.current?.querySelectorAll('.maze-svg');
    if (!svgElements || svgElements.length === 0) return;

    const pageW = landscape ? 297 : 210;
    const pageH = landscape ? 210 : 297;

    let combinedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${pageW}mm" height="${(pageH * svgElements.length)}mm" viewBox="0 0 ${pageW} ${pageH * svgElements.length}">\n`;
    for (let i = 0; i < svgElements.length; i++) {
      const svg = svgElements[i] as SVGSVGElement;
      const inner = svg.innerHTML;
      combinedSVG += `<g transform="translate(0, ${pageH * i})">\n${inner}\n</g>\n`;
    }
    combinedSVG += '</svg>';

    const blob = new Blob([combinedSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maze-generator.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [landscape]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (mazes.length === 0) return null;

  const pages = groupMazes(mazes);

  return (
    <div className="preview-panel">
      <div className="preview-actions">
        <button onClick={handleDownload}>Download SVG</button>
        <button onClick={handlePrint}>Print</button>
        <span className="maze-count">{mazes.length} maze{mazes.length > 1 ? 's' : ''}</span>
      </div>
      <div className="preview-container" ref={containerRef}>
        {pages.map((page, i) =>
          renderPageSVG(page, config.drawingArea, landscape, i)
        )}
      </div>
    </div>
  );
}
