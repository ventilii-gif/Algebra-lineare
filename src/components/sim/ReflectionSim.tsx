import { useEffect, useState } from "react";

// Simulazione guidata della riflessione di un punto rispetto a una retta
// (retta per l'origine con angolo θ regolabile). Premendo «Rifletti» un punto
// anima il tragitto da P al suo riflesso P', attraversando lo specchio.

export function ReflectionSim() {
  const [deg, setDeg] = useState(30);
  const [px, setPx] = useState(3);
  const [py, setPy] = useState(1);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (t >= 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setT((x) => Math.min(1, Math.round((x + 0.04) * 100) / 100)), 40);
    return () => clearTimeout(id);
  }, [playing, t]);

  const th = (deg * Math.PI) / 180;
  const d = { x: Math.cos(th), y: Math.sin(th) };
  const dot = px * d.x + py * d.y;
  // P' = 2(P·d)d − P
  const pr = { x: 2 * dot * d.x - px, y: 2 * dot * d.y - py };
  const H = { x: (px + pr.x) / 2, y: (py + pr.y) / 2 };
  const moving = { x: px + (pr.x - px) * t, y: py + (pr.y - py) * t };

  const size = 360;
  const range = 6;
  const scale = size / (2 * range);
  const sx = (x: number) => size / 2 + x * scale;
  const sy = (y: number) => size / 2 - y * scale;
  const ticks = Array.from({ length: 2 * range + 1 }, (_, i) => i - range);
  const L = range * 2;

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Riflessione di un punto <b>P</b> rispetto a una <b>retta (specchio)</b> passante per
        l'origine, inclinata dell'angolo θ. Il riflesso <b>P'</b> sta dalla parte opposta, alla
        stessa distanza; il segmento P–P' è perpendicolare allo specchio e il suo punto medio{" "}
        <b>H</b> sta sulla retta. Premi «Rifletti» per animare.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
          {ticks.map((tk) => (
            <g key={tk} stroke="var(--border)" strokeWidth={0.5}>
              <line x1={sx(tk)} y1={0} x2={sx(tk)} y2={size} />
              <line x1={0} y1={sy(tk)} x2={size} y2={sy(tk)} />
            </g>
          ))}
          <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke="#8a8a9a" strokeWidth={1.2} />
          <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke="#8a8a9a" strokeWidth={1.2} />
          {/* specchio */}
          <line x1={sx(-L * d.x)} y1={sy(-L * d.y)} x2={sx(L * d.x)} y2={sy(L * d.y)} stroke="#5b5bd6" strokeWidth={2.4} />
          <text x={sx(L * d.x * 0.8)} y={sy(L * d.y * 0.8) - 6} fill="#5b5bd6" fontSize={13} fontWeight={700}>specchio</text>
          {/* segmento P-P' */}
          <line x1={sx(px)} y1={sy(py)} x2={sx(pr.x)} y2={sy(pr.y)} stroke="#8a8a9a" strokeWidth={1} strokeDasharray="4,4" />
          <circle cx={sx(H.x)} cy={sy(H.y)} r={3} fill="#5b5bd6" />
          <text x={sx(H.x) + 6} y={sy(H.y) + 12} fill="#5b5bd6" fontSize={12} fontWeight={700}>H</text>
          {/* P e P' */}
          <circle cx={sx(px)} cy={sy(py)} r={4} fill="#d64545" />
          <text x={sx(px) + 7} y={sy(py) - 7} fill="#d64545" fontSize={14} fontWeight={700}>P</text>
          <circle cx={sx(pr.x)} cy={sy(pr.y)} r={4} fill="#1f9d55" />
          <text x={sx(pr.x) + 7} y={sy(pr.y) - 7} fill="#1f9d55" fontSize={14} fontWeight={700}>P'</text>
          {/* punto in movimento */}
          {t > 0 && t < 1 && <circle cx={sx(moving.x)} cy={sy(moving.y)} r={5} fill="#c07a12" />}
        </svg>
        <div style={{ minWidth: 210 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ margin: 0 }}>P = ({px}, {py})</p>
            <p style={{ margin: "0.3rem 0 0", fontWeight: 600 }}>P' = ({Math.round(pr.x * 100) / 100}, {Math.round(pr.y * 100) / 100})</p>
          </div>
          <div className="btn-row">
            <button className="btn" onClick={() => { if (t >= 1) setT(0); setPlaying(true); }}>Rifletti</button>
            <button className="btn secondary" onClick={() => { setPlaying(false); setT(0); }}>Ripristina</button>
          </div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            angolo specchio θ = {deg}°
            <input type="range" min={0} max={180} value={deg} onChange={(e) => { setPlaying(false); setT(0); setDeg(Number(e.target.value)); }} style={{ width: "100%" }} />
          </label>
          <p style={{ fontWeight: 600, margin: "0.5rem 0 0.2rem" }}>P = ({px}, {py})</p>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <input className="matrix-cell" type="number" value={px} onChange={(e) => { setPlaying(false); setT(0); setPx(parseFloat(e.target.value) || 0); }} />
            <input className="matrix-cell" type="number" value={py} onChange={(e) => { setPlaying(false); setT(0); setPy(parseFloat(e.target.value) || 0); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
