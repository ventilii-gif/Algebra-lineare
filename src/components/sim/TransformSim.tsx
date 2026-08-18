import { useEffect, useMemo, useState } from "react";
import { VectorPlane } from "../VectorPlane";

// Simulazione guidata: morphing della griglia dall'identità alla matrice A,
// con i vettori immagine di e1 ed e2. Mostra come una matrice 2x2 deforma il piano.

export function TransformSim() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [c, setC] = useState(-0.5);
  const [d, setD] = useState(1);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (t >= 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setT((x) => Math.min(1, Math.round((x + 0.05) * 100) / 100)), 60);
    return () => clearTimeout(id);
  }, [playing, t]);

  // M(t) = (1-t) I + t A ; colonne = immagini di e1, e2
  const m1 = { x: 1 - t + t * a, y: t * c };
  const m2 = { x: t * b, y: 1 - t + t * d };
  const det = a * d - b * c;

  const gridLines = useMemo(() => {
    const N = 4;
    const map = (x: number, y: number) => ({ x: m1.x * x + m2.x * y, y: m1.y * x + m2.y * y });
    const lines: { from: [number, number]; to: [number, number] }[] = [];
    for (let k = -N; k <= N; k++) {
      const p1 = map(k, -N), p2 = map(k, N);
      lines.push({ from: [p1.x, p1.y], to: [p2.x, p2.y] });
      const q1 = map(-N, k), q2 = map(N, k);
      lines.push({ from: [q1.x, q1.y], to: [q2.x, q2.y] });
    }
    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m1.x, m1.y, m2.x, m2.y]);

  const caption = t === 0 ? "t = 0: partiamo dalla griglia originale (matrice identità)." : t >= 1 ? "t = 1: la griglia è completamente trasformata dalla matrice A." : "Trascinando t la griglia si deforma con continuità: ogni retta resta retta e l'origine resta ferma (linearità).";

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Una trasformazione lineare manda l'intera griglia in una nuova griglia (rette in rette,
        origine fissa). Premi «Avvia» per animare il passaggio dall'identità alla matrice{" "}
        <b>A = [[a, b], [c, d]]</b>.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <VectorPlane
          range={6}
          size={360}
          gridLines={gridLines}
          vectors={[
            { x: m1.x, y: m1.y, color: "#5b5bd6", label: "A·e1" },
            { x: m2.x, y: m2.y, color: "#d64545", label: "A·e2" },
          ]}
        />
        <div style={{ minWidth: 210 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ margin: 0 }}>{caption}</p>
            <p style={{ margin: "0.4rem 0 0", color: "var(--text-muted)" }}>det(A) = {Math.round(det * 100) / 100} (fattore di scala delle aree)</p>
          </div>
          <div className="btn-row">
            <button className="btn" onClick={() => { if (t >= 1) setT(0); setPlaying(true); }}>Avvia</button>
            <button className="btn secondary" onClick={() => { setPlaying(false); setT(0); }}>Ripristina</button>
          </div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            t = {t.toFixed(2)}
            <input type="range" min={0} max={1} step={0.01} value={t} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} style={{ width: "100%" }} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", width: "10rem", marginTop: "0.5rem" }}>
            {([["a", a, setA], ["b", b, setB], ["c", c, setC], ["d", d, setD]] as const).map(([lab, val, set]) => (
              <label key={lab} style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {lab}
                <input className="matrix-cell" type="number" step="0.5" value={val} onChange={(e) => set(parseFloat(e.target.value) || 0)} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
