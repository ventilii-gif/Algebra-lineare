import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { parseMatrix, solveSystem } from "../../lib/matrix";
import { Fraction } from "../../lib/fraction";
import { Steps } from "../../components/Steps";

export function SistemaTool() {
  const [eqs, setEqs] = useState(3);
  const [unknowns, setUnknowns] = useState(3);
  const [strA, setStrA] = useState<string[][]>([]);
  const [strB, setStrB] = useState<string[]>(Array(3).fill("0"));
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const A = parseMatrix(strA);
      const b = Array.from({ length: eqs }, (_, i) => Fraction.parse(strB[i] || "0"));
      return solveSystem(A, b);
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strA, strB, eqs]);

  function setBCell(i: number, v: string) {
    setStrB((prev) => {
      const next = Array.from({ length: eqs }, (_, k) => prev[k] ?? "0");
      next[i] = v;
      return next;
    });
  }

  return (
    <div>
      <div className="btn-row">
        <SizeControl label="equazioni" value={eqs} onChange={setEqs} />
        <SizeControl label="incognite" value={unknowns} onChange={setUnknowns} />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontWeight: 600 }}>Matrice dei coefficienti A</p>
          <MatrixInput rows={eqs} cols={unknowns} onChange={setStrA} />
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Termini noti b</p>
          <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
            {Array.from({ length: eqs }, (_, i) => (
              <input
                key={i}
                className="matrix-cell"
                value={strB[i] ?? "0"}
                onChange={(e) => setBCell(i, e.target.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {error && <div className="result-box error">{error}</div>}
      {result && (
        <>
          <div className={`result-box ${result.type === "none" ? "error" : ""}`}>
            {result.type === "unique" && (
              <p style={{ fontWeight: 600 }}>
                Soluzione unica: ({result.solution!.map((s) => s.toString()).join(", ")})
              </p>
            )}
            {result.type === "none" && <p style={{ fontWeight: 600 }}>Sistema impossibile</p>}
            {result.type === "infinite" && result.parametric && (
              <div>
                <p style={{ fontWeight: 600 }}>Infinite soluzioni:</p>
                <p className="mono">
                  x = ({result.parametric.particular.map((s) => s.toString()).join(", ")})
                  {result.parametric.directions.map((dir, i) => (
                    <span key={i}>
                      {" "}
                      + t{i + 1}·({dir.map((s) => s.toString()).join(", ")})
                    </span>
                  ))}
                </p>
              </div>
            )}
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
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
