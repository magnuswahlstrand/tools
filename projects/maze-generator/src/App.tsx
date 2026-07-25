import { useState, useCallback, useEffect } from 'react';
import { generateMaze } from './maze/generator';
import { solveMaze } from './maze/solver';
import { placeLetters } from './maze/letters';
import { getCornerCell } from './maze/corner';
import type { Corner } from './maze/corner';
import type { Cell } from './maze/grid';
import type { Grid } from './maze/grid';
import type { LetterPlacement } from './maze/letters';
import { MazeConfig, type ConfigValues } from './components/MazeConfig';
import { MazePreview } from './components/MazePreview';
import './App.css';

interface MazeData {
  word: string;
  grid: Grid;
  solutionPath: Cell[];
  letterPlacements: LetterPlacement[];
  startCorner: Corner;
  finishCorner: Corner;
}

const STORAGE_KEY = 'maze-generator-config';

const DEFAULT_CONFIG: ConfigValues = {
  word: 'cat, dog',
  rows: 8,
  cols: 8,
  decoyLetters: true,
  decoyChars: '',
  drawingArea: true,
  landscape: false,
};

function loadConfig(): ConfigValues {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_CONFIG };
}

function App() {
  const [configValues, setConfigValues] = useState<ConfigValues>(loadConfig);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configValues));
  }, [configValues]);

  const [mazeData, setMazeData] = useState<MazeData[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = useCallback(() => {
    setError('');

    const words = configValues.word.split(',').map((w) => w.trim()).filter(Boolean);
    if (words.length === 0) {
      setError('Please enter at least one word.');
      return;
    }

    const mazes: MazeData[] = [];

    for (const word of words) {
      const { grid, startCorner, finishCorner } = generateMaze(
        configValues.rows, configValues.cols,
      );

      const entrance = getCornerCell(configValues.rows, configValues.cols, startCorner);
      const exit = getCornerCell(configValues.rows, configValues.cols, finishCorner);
      const solutionPath = solveMaze(grid, entrance.row, entrance.col, exit.row, exit.col);
      const letterPlacements = placeLetters(
        grid, solutionPath, word, configValues.decoyLetters, configValues.decoyChars,
      );

      mazes.push({
        word, grid, solutionPath, letterPlacements,
        startCorner, finishCorner,
      });
    }

    setMazeData(mazes);
  }, [configValues]);

  return (
    <div className="app">
      <MazeConfig values={configValues} onChange={setConfigValues} onGenerate={handleGenerate} />
      <div className="preview-panel">
        {error && <div className="error-banner">{error}</div>}
        <MazePreview
          mazes={mazeData}
          config={{
            decoyLetters: configValues.decoyLetters,
            drawingArea: configValues.drawingArea,
            landscape: configValues.landscape,
          }}
        />
      </div>
    </div>
  );
}

export default App;
