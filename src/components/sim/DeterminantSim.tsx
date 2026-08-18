import { useState } from "react";

// Simulazione: il determinante 2x2 è l'area con segno del parallelogramma
// generato dalle colonne. Muovendo i vettori si vede l'area cambiare (e il
// segno invertirsi quando l'orientamento si ribalta).

export function DeterminantSim() {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  const [vx, setVx] = useState(1);
  const [vy, setVy] = useState(2);

  const det = ux * vy - uy * vx;
  const size = 360;
  const range = 6;
  const scale = size / (2 * range);
  const sx = (x: number) => size / 2 + x * scale;
  const sy = (y: number) => size / 2 - y * scale;
  const ticks = Array.from({ length: 2 * range + 1 }, (_, i) => i - range);

  const poly = [[0, 0], [ux, uy], [ux + vx, uy + vy], [vx, vy]].map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ");

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Il determinante <b>det[u v]</b> è l'<b>area con segno</b> del parallelogramma generato da u
        e v. Muovi i vettori: quando l'orientamento si ribalta, il segno cambia; se u e v diventano
        paralleli, l'area (e il determinante) si annulla.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
          {ticks.map((t) => (
            <g key={t} stroke="var(--border)" strokeWidth={0.5}>
              <line x1={sx(t)} y1={0} x2={sx(t)} y2={size} />
              <line x1={0} y1={sy(t)} x2={size} y2={sy(t)} />
            </g>
          ))}
          <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke="#8a8a9a" strokeWidth={1.2} />
          <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke="#8a8a9a" strokeWidth={1.2} />
          <polygon points={poly} fill={det >= 0 ? "#5b5bd6" : "#d64545"} fillOpacity={0.18} stroke={det >= 0 ? "#5b5bd6" : "#d64545"} strokeWidth={1.5} />
          <line x1={sx(0)} y1={sy(0)} x2={sx(ux)} y2={sy(uy)} stroke="#5b5bd6" strokeWidth={2.6} />
          <text x={sx(ux) + 5} y={sy(uy) - 5} fill="#5b5bd6" fontSize={13} fontWeight={700}>u</text>
          <line x1={sx(0)} y1={sy(0)} x2={sx(vx)} y2={sy(vy)} stroke="#d64545" strokeWidth={2.6} />
          <text x={sx(vx) + 5} y={sy(vy) - 5} fill="#d64545" fontSize={13} fontWeight={700}>v</text>
        </svg>
        <div style={{ minWidth: 200 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>det = {Math.round(det * 100) / 100}</p>
            <p style={{ margin: "0.3rem 0 0", color: "var(--text-muted)" }}>Area = |det| = {Math.round(Math.abs(det) * 100) / 100}</p>
          </div>
          <p style={{ fontWeight: 600, margin: "0.5rem 0 0.2rem" }}>u = ({ux}, {uy})</p>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <input className="matrix-cell" type="number" value={ux} onChange={(e) => setUx(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={uy} onChange={(e) => setUy(parseFloat(e.target.value) || 0)} />
          </div>
          <p style={{ fontWeight: 600, margin: "0.5rem 0 0.2rem" }}>v = ({vx}, {vy})</p>
          <div style={{ display: "flex", gap: "0.3rem" }}>
            <input className="matrix-cell" type="number" value={vx} onChange={(e) => setVx(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={vy} onChange={(e) => setVy(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
      </div>
    </div>
  );
}
