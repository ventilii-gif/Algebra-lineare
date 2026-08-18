import { useEffect, useState } from "react";

// Simulazione guidata: si fa ruotare un vettore unitario v(θ) e si osserva A·v.
// Quando A·v è parallelo a v, v è un autovettore (A·v = λv). Animazione con play.

export function EigenSim() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const [d, setD] = useState(2);
  const [deg, setDeg] = useState(20);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setDeg((x) => (x + 2) % 360), 40);
    return () => clearTimeout(id);
  }, [playing, deg]);

  const th = (deg * Math.PI) / 180;
  const v = { x: Math.cos(th), y: Math.sin(th) };
  const Av = { x: a * v.x + b * v.y, y: c * v.x + d * v.y };
  // parallelismo: prodotto vettoriale (scalare) ~ 0
  const cross = v.x * Av.y - v.y * Av.x;
  const parallel = Math.abs(cross) < 0.03;
  // lambda approssimato (proiezione)
  const lambda = v.x * Av.x + v.y * Av.y;

  const size = 340;
  const range = 4;
  const scale = size / (2 * range);
  const sx = (x: number) => size / 2 + x * scale;
  const sy = (y: number) => size / 2 - y * scale;

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Facciamo ruotare un vettore unitario <b>v</b> e osserviamo <b>A·v</b>. Quando A·v è{" "}
        <b>parallelo</b> a v, allora v è un <b>autovettore</b> (A·v = λv). Premi «Avvia» e guarda
        quando le due frecce si allineano.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
          <defs>
            <marker id="eg-v" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#5b5bd6" /></marker>
            <marker id="eg-av" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={parallel ? "#1f9d55" : "#d64545"} /></marker>
          </defs>
          <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke="#8a8a9a" strokeWidth={1} />
          <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke="#8a8a9a" strokeWidth={1} />
          <circle cx={sx(0)} cy={sy(0)} r={scale} fill="none" stroke="var(--border)" strokeWidth={1} />
          <line x1={sx(0)} y1={sy(0)} x2={sx(Av.x)} y2={sy(Av.y)} stroke={parallel ? "#1f9d55" : "#d64545"} strokeWidth={2.6} markerEnd="url(#eg-av)" />
          <text x={sx(Av.x) + 5} y={sy(Av.y) - 5} fill={parallel ? "#1f9d55" : "#d64545"} fontSize={13} fontWeight={700}>A·v</text>
          <line x1={sx(0)} y1={sy(0)} x2={sx(v.x)} y2={sy(v.y)} stroke="#5b5bd6" strokeWidth={2.6} markerEnd="url(#eg-v)" />
          <text x={sx(v.x) + 5} y={sy(v.y) - 5} fill="#5b5bd6" fontSize={13} fontWeight={700}>v</text>
        </svg>
        <div style={{ minWidth: 210 }}>
          <div className="result-box" style={{ marginTop: 0, borderLeftColor: parallel ? "#1f9d55" : undefined }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{parallel ? "Allineati! v è un autovettore ✅" : "A·v non è parallelo a v"}</p>
            {parallel && <p style={{ margin: "0.3rem 0 0" }}>λ ≈ {Math.round(lambda * 100) / 100}</p>}
          </div>
          <div className="btn-row">
            <button className="btn" onClick={() => setPlaying((p) => !p)}>{playing ? "Pausa" : "Avvia"}</button>
          </div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            angolo θ = {deg}°
            <input type="range" min={0} max={359} value={deg} onChange={(e) => { setPlaying(false); setDeg(Number(e.target.value)); }} style={{ width: "100%" }} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", width: "10rem", marginTop: "0.4rem" }}>
            {([["a", a, setA], ["b", b, setB], ["c", c, setC], ["d", d, setD]] as const).map(([lab, val, set]) => (
              <label key={lab} style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {lab}
                <input className="matrix-cell" type="number" step="1" value={val} onChange={(e) => set(parseFloat(e.target.value) || 0)} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
