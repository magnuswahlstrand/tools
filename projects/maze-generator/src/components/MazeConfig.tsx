import type { ChangeEvent } from 'react';

export interface ConfigValues {
  word: string;
  rows: number;
  cols: number;
  decoyLetters: boolean;
  decoyChars: string;
  drawingArea: boolean;
  landscape: boolean;
}

interface MazeConfigProps {
  values: ConfigValues;
  onChange: (values: ConfigValues) => void;
  onGenerate: () => void;
}

export function MazeConfig({ values, onChange, onGenerate }: MazeConfigProps) {
  const update = <K extends keyof ConfigValues>(key: K, value: ConfigValues[K]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="config-panel">
      <h2>Settings</h2>

      <label>
        Word
        <input
          type="text"
          value={values.word}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update('word', e.target.value)}
          placeholder="cat, dog, fish"
        />
      </label>

      <div className="config-row">
        <label>
          Columns
          <input
            type="number"
            min={4}
            max={50}
            value={values.cols}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('cols', Math.max(4, parseInt(e.target.value) || 4))}
          />
        </label>
        <label>
          Rows
          <input
            type="number"
            min={4}
            max={50}
            value={values.rows}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('rows', Math.max(4, parseInt(e.target.value) || 4))}
          />
        </label>
      </div>

      <div className="config-checkboxes">
        <label>
          <input
            type="checkbox"
            checked={values.decoyLetters}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('decoyLetters', e.target.checked)}
          />
          Decoy letters
        </label>
        <label>
          <input
            type="checkbox"
            checked={values.drawingArea}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('drawingArea', e.target.checked)}
          />
          Drawing area
        </label>
        <label>
          <input
            type="checkbox"
            checked={values.landscape}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('landscape', e.target.checked)}
          />
          Landscape
        </label>
      </div>

      {values.decoyLetters && (
        <label className="decoy-chars-label">
          Allowed decoy characters
          <input
            type="text"
            value={values.decoyChars}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('decoyChars', e.target.value)}
            placeholder="A-Z (default)"
          />
        </label>
      )}

      <button className="generate-btn" onClick={onGenerate}>
        Generate
      </button>
    </div>
  );
}
