import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { addMat, subMat, scalarMul, multiplyMat, transpose, parseMatrix, matToString } from "../../lib/matrix";
import { Fraction } from "../../lib/fraction";

type Op = "add" | "sub" | "mul" | "scalar" | "transpose";

export function OperazioniTool() {
  const [op, setOp] = useState<Op>("mul");
  const [rowsA, setRowsA] = useState(2);
  const [colsA, setColsA] = useState(2);
  const [rowsB, setRowsB] = useState(2);
  const [colsB, setColsB] = useState(2);
  const [strA, setStrA] = useState<string[][]>([]);
  const [strB, setStrB] = useState<string[][]>([]);
  const [scalar, setScalar] = useState("2");
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const A = parseMatrix(strA);
      if (op === "transpose") return matToString(transpose(A));
      if (op === "scalar") return matToString(scalarMul(Fraction.parse(scalar), A));
      const B = parseMatrix(strB);
      if (op === "add") return matToString(addMat(A, B));
      if (op === "sub") return matToString(subMat(A, B));
      if (op === "mul") return matToString(multiplyMat(A, B));
      return "";
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [op, strA, strB, scalar]);

  const needsB = op === "add" || op === "sub" || op === "mul";

  return (
    <div>
      <div className="tab-row">
        {([
          ["mul", "A × B"],
          ["add", "A + B"],
          ["sub", "A − B"],
          ["scalar", "k · A"],
          ["transpose", "Aᵀ"],
        ] as [Op, string][]).map(([id, label]) => (
          <button key={id} className={`tab-btn ${op === id ? "active" : ""}`} onClick={() => setOp(id)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "start" }}>
        <div>
          <p style={{ fontWeight: 600 }}>Matrice A</p>
          <div className="btn-row">
            <SizeControl label="righe" value={rowsA} onChange={setRowsA} />
            <SizeControl label="colonne" value={colsA} onChange={setColsA} />
          </div>
          <MatrixInput rows={rowsA} cols={colsA} onChange={setStrA} labelPrefix="a" />
        </div>

        {op === "scalar" && (
          <div>
            <p style={{ fontWeight: 600 }}>Scalare k</p>
            <input className="matrix-cell" style={{ width: "5rem" }} value={scalar} onChange={(e) => setScalar(e.target.value)} />
          </div>
        )}

        {needsB && (
          <div>
            <p style={{ fontWeight: 600 }}>Matrice B</p>
            <div className="btn-row">
              <SizeControl label="righe" value={rowsB} onChange={setRowsB} />
              <SizeControl label="colonne" value={colsB} onChange={setColsB} />
            </div>
            <MatrixInput rows={rowsB} cols={colsB} onChange={setStrB} labelPrefix="b" />
          </div>
        )}
      </div>

      {error && <div className="result-box error">{error}</div>}
      {result && !error && (
        <div className="result-box">
          <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Risultato</p>
          <pre style={{ margin: 0, fontFamily: "inherit" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}

function SizeControl({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
      {label}:{" "}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
