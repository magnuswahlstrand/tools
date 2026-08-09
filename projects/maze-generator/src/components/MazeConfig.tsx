import type { ChangeEvent } from 'react';

export interface ConfigValues {
  word: string;
  rows: number;
  cols: number;
  copies: number;
  useWords: boolean;
  showDecoys: boolean;
  decoyChars: string;
  drawingArea: boolean;
  landscape: boolean;
}

interface MazeConfigProps {
  values: ConfigValues;
  onChange: (values: ConfigValues) => void;
}

export function MazeConfig({ values, onChange }: MazeConfigProps) {
  const update = <K extends keyof ConfigValues>(key: K, value: ConfigValues[K]) => {
    onChange({ ...values, [key]: value });
  };

  return (
    <div className="config-panel">
      <h2>Settings</h2>

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

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={values.useWords}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update('useWords', e.target.checked)}
        />
        Use words
      </label>
      {values.useWords && (
        <label>
          Word
          <input
            type="text"
            value={values.word}
            onChange={(e: ChangeEvent<HTMLInputElement>) => update('word', e.target.value)}
            placeholder="cat, dog, fish"
          />
        </label>
      )}
      <label>
        Copies
        <input
          type="number"
          min={1}
          max={20}
          value={values.copies}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update('copies', Math.max(1, parseInt(e.target.value) || 1))}
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={values.showDecoys}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update('showDecoys', e.target.checked)}
        />
        Show decoy letters
      </label>
      {values.showDecoys && (
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
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={values.drawingArea}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update('drawingArea', e.target.checked)}
        />
        Drawing area
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={values.landscape}
          onChange={(e: ChangeEvent<HTMLInputElement>) => update('landscape', e.target.checked)}
        />
        Landscape
      </label>

    </div>
  );
}
