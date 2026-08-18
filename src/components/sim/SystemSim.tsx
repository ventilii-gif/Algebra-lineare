import { useState } from "react";
import { VectorPlane } from "../VectorPlane";

// Simulazione: sistema di 2 equazioni in 2 incognite come intersezione di due
// rette. Il punto di intersezione è la soluzione.

export function SystemSim() {
  // a1 x + b1 y = c1 ; a2 x + b2 y = c2
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(3);
  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(0);

  const det = a1 * b2 - a2 * b1;
  const sol = det !== 0 ? { x: (c1 * b2 - c2 * b1) / det, y: (a1 * c2 - a2 * c1) / det } : null;

  // punti estremi delle rette per il disegno
  function linePoints(a: number, b: number, c: number): [number, number][] {
    const R = 10;
    if (Math.abs(b) >= Math.abs(a)) {
      return [[-R, (c - a * -R) / b], [R, (c - a * R) / b]];
    }
    return [[(c - b * -R) / a, -R], [(c - b * R) / a, R]];
  }
  const L1 = b1 !== 0 || a1 !== 0 ? linePoints(a1, b1, c1) : null;
  const L2 = b2 !== 0 || a2 !== 0 ? linePoints(a2, b2, c2) : null;

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Un sistema <b>2×2</b> è l'intersezione di due rette. Un punto d'incontro = <b>soluzione
        unica</b>; rette parallele = <b>nessuna soluzione</b>; rette coincidenti = <b>infinite</b>.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <VectorPlane
          range={8}
          size={360}
          vectors={sol ? [{ x: sol.x, y: sol.y, color: "#1f9d55", label: "sol" }] : []}
          gridLines={[
            ...(L1 ? [{ from: L1[0], to: L1[1], color: "#5b5bd6" as string }] : []),
            ...(L2 ? [{ from: L2[0], to: L2[1], color: "#d64545" as string }] : []),
          ]}
        />
        <div style={{ minWidth: 220 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            {sol ? (
              <p style={{ margin: 0 }}>Soluzione unica: ({Math.round(sol.x * 100) / 100}, {Math.round(sol.y * 100) / 100})</p>
            ) : (
              <p style={{ margin: 0 }}>det = 0: rette parallele o coincidenti (nessuna o infinite soluzioni).</p>
            )}
          </div>
          <p style={{ fontWeight: 600, margin: "0.5rem 0 0.2rem" }}>Retta 1: a₁x + b₁y = c₁</p>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <input className="matrix-cell" type="number" value={a1} onChange={(e) => setA1(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={b1} onChange={(e) => setB1(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={c1} onChange={(e) => setC1(parseFloat(e.target.value) || 0)} />
          </div>
          <p style={{ fontWeight: 600, margin: "0.5rem 0 0.2rem" }}>Retta 2: a₂x + b₂y = c₂</p>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <input className="matrix-cell" type="number" value={a2} onChange={(e) => setA2(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={b2} onChange={(e) => setB2(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={c2} onChange={(e) => setC2(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>
    </div>
  );
}
