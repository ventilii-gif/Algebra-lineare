import { useEffect, useState } from "react";

interface Props {
  rows: number;
  cols: number;
  onChange: (values: string[][]) => void;
  initial?: string[][];
  labelPrefix?: string;
}

export function MatrixInput({ rows, cols, onChange, initial, labelPrefix = "a" }: Props) {
  const [values, setValues] = useState<string[][]>(
    initial ?? Array.from({ length: rows }, () => Array.from({ length: cols }, () => "0"))
  );

  useEffect(() => {
    setValues((prev) => {
      const next = Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => prev[i]?.[j] ?? "0")
      );
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cols]);

  useEffect(() => {
    onChange(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  function setCell(i: number, j: number, v: string) {
    setValues((prev) => prev.map((row, ri) => (ri === i ? row.map((c, ci) => (ci === j ? v : c)) : row)));
  }

  return (
    <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
      {values.map((row, i) =>
        row.map((cell, j) => (
          <input
            key={`${i}-${j}`}
            className="matrix-cell"
            value={cell}
            aria-label={`${labelPrefix}${i + 1}${j + 1}`}
            onChange={(e) => setCell(i, j, e.target.value)}
            inputMode="text"
          />
        ))
      )}
    </div>
  );
}
