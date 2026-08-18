import { useEffect, useState } from "react";

const COL_U = "#5b5bd6";
const COL_V = "#d64545";
const COL_SUM = "#1f9d55";
const COL_AX = "#8a8a9a";

const captions = [
  "Partiamo da due vettori u (blu) e v (rosso) applicati nell'origine O.",
  "Trasliamo v mantenendolo parallelo a sé stesso, fino a portarne la coda sulla punta di u (regola punta-coda).",
  "Il vettore somma u + v (verde) va dall'origine O fino alla punta di v traslato. Il parallelogramma mostra che u + v = v + u.",
];

export function VettoriSimulazione() {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  const [vx, setVx] = useState(1);
  const [vy, setVy] = useState(2);
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (phase >= 2) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setPhase((p) => Math.min(2, p + 1)), 1400);
    return () => clearTimeout(id);
  }, [playing, phase]);

  const size = 360;
  const range = 6;
  const scale = size / (2 * range);
  const sx = (x: number) => size / 2 + x * scale;
  const sy = (y: number) => size / 2 - y * scale;

  const sum = { x: ux + vx, y: uy + vy };
  const ticks = Array.from({ length: 2 * range + 1 }, (_, i) => i - range);

  function Arrow({ x1, y1, x2, y2, color, label, dashed }: { x1: number; y1: number; x2: number; y2: number; color: string; label?: string; dashed?: boolean }) {
    const id = `sim-${color.replace("#", "")}`;
    return (
      <g>
        <defs>
          <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
        <line x1={sx(x1)} y1={sy(y1)} x2={sx(x2)} y2={sy(y2)} stroke={color} strokeWidth={2.6} strokeDasharray={dashed ? "5,4" : undefined} markerEnd={`url(#${id})`} />
        {label && <text x={sx(x2) + 6} y={sy(y2) - 6} fill={color} fontSize={14} fontWeight={700}>{label}</text>}
      </g>
    );
  }

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Animazione guidata della <b>somma di vettori</b> (regola punta-coda / parallelogramma). Usa
        «Avvia» per vederla costruire passo-passo, oppure avanza un passo alla volta.
      </p>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
          {ticks.map((t) => (
            <g key={t} stroke="var(--border)" strokeWidth={0.5}>
              <line x1={sx(t)} y1={0} x2={sx(t)} y2={size} />
              <line x1={0} y1={sy(t)} x2={size} y2={sy(t)} />
            </g>
          ))}
          <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke={COL_AX} strokeWidth={1.2} />
          <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke={COL_AX} strokeWidth={1.2} />
          <text x={sx(0) - 14} y={sy(0) + 15} fill={COL_AX} fontSize={13} fontWeight={700}>O</text>

          {/* parallelogramma (fase 2) */}
          {phase >= 2 && (
            <>
              <line x1={sx(ux)} y1={sy(uy)} x2={sx(sum.x)} y2={sy(sum.y)} stroke={COL_V} strokeWidth={1} opacity={0.4} strokeDasharray="4,4" />
              <line x1={sx(vx)} y1={sy(vy)} x2={sx(sum.x)} y2={sy(sum.y)} stroke={COL_U} strokeWidth={1} opacity={0.4} strokeDasharray="4,4" />
            </>
          )}

          {/* u sempre visibile */}
          <Arrow x1={0} y1={0} x2={ux} y2={uy} color={COL_U} label="u" />

          {/* v: dall'origine (fase 0) oppure traslato sulla punta di u (fasi 1-2) */}
          {phase === 0 ? (
            <Arrow x1={0} y1={0} x2={vx} y2={vy} color={COL_V} label="v" />
          ) : (
            <Arrow x1={ux} y1={uy} x2={sum.x} y2={sum.y} color={COL_V} label="v" dashed />
          )}

          {/* somma (fase 2) */}
          {phase >= 2 && <Arrow x1={0} y1={0} x2={sum.x} y2={sum.y} color={COL_SUM} label="u+v" />}
        </svg>

        <div style={{ minWidth: 200 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ fontWeight: 600, margin: 0 }}>Passo {phase + 1} di 3</p>
            <p style={{ margin: "0.4rem 0 0" }}>{captions[phase]}</p>
          </div>
          <div className="btn-row">
            <button className="btn" onClick={() => { if (phase >= 2) setPhase(0); setPlaying(true); }}>Avvia</button>
            <button className="btn secondary" onClick={() => setPhase((p) => Math.min(2, p + 1))}>Passo successivo</button>
            <button className="btn secondary" onClick={() => { setPhase(0); setPlaying(false); }}>Ripristina</button>
          </div>

          <p style={{ fontWeight: 600, marginBottom: "0.3rem" }}>u = ({ux}, {uy})</p>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input className="matrix-cell" type="number" value={ux} onChange={(e) => setUx(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={uy} onChange={(e) => setUy(parseFloat(e.target.value) || 0)} />
          </div>
          <p style={{ fontWeight: 600, margin: "0.6rem 0 0.3rem" }}>v = ({vx}, {vy})</p>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input className="matrix-cell" type="number" value={vx} onChange={(e) => setVx(parseFloat(e.target.value) || 0)} />
            <input className="matrix-cell" type="number" value={vy} onChange={(e) => setVy(parseFloat(e.target.value) || 0)} />
          </div>
          <p style={{ marginTop: "0.7rem", color: "var(--text-muted)" }}>u + v = ({sum.x}, {sum.y})</p>
        </div>
      </div>
    </div>
  );
}
