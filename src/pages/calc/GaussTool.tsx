import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { MatrixDisplay } from "../../components/MatrixDisplay";
import { Steps } from "../../components/Steps";
import { parseMatrix, gaussEliminationWithSteps, gaussJordan } from "../../lib/matrix";

type ModeG = "scala" | "ridotta";

export function GaussTool() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [modeG, setModeG] = useState<ModeG>("scala");
  const [str, setStr] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const A = parseMatrix(str);
      if (A.length !== rows || A.some((r) => r.length !== cols)) return null;
      if (modeG === "scala") {
        const r = gaussEliminationWithSteps(A);
        return { matrix: r.matrix, steps: r.steps, rank: r.rank };
      }
      const r = gaussJordan(A);
      return { matrix: r.matrix, steps: [...r.steps, `Forma ridotta ottenuta. Rango = ${r.pivotCols.length}.`], rank: r.pivotCols.length };
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str, rows, cols, modeG]);

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Riduce la matrice con operazioni elementari sulle righe. La <b>forma a scala</b> (Gauss)
        elimina solo sotto i pivot; la <b>forma ridotta</b> (Gauss-Jordan) porta i pivot a 1 ed
        elimina anche sopra. Il numero di pivot è il <b>rango</b>.
      </p>

      <div className="btn-row">
        <button className={`tab-btn ${modeG === "scala" ? "active" : ""}`} onClick={() => setModeG("scala")}>
          Forma a scala (Gauss)
        </button>
        <button className={`tab-btn ${modeG === "ridotta" ? "active" : ""}`} onClick={() => setModeG("ridotta")}>
          Forma ridotta (Gauss-Jordan)
        </button>
      </div>

      <div className="btn-row">
        <SizeControl label="righe" value={rows} onChange={setRows} />
        <SizeControl label="colonne" value={cols} onChange={setCols} />
      </div>
      <MatrixInput rows={rows} cols={cols} onChange={setStr} />

      {error && <div className="result-box error">{error}</div>}

      {result && (
        <>
          <div className="result-box">
            <MatrixDisplay matrix={result.matrix} bracket="p" />
            <p style={{ marginTop: "0.4rem" }}>Rango = {result.rank}</p>
          </div>
          <Steps steps={result.steps} />
        </>
      )}
    </div>
  );
}

function SizeControl({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
      {label}:{" "}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
