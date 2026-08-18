import { useState } from "react";
import { LineProjectionPlot } from "../LineProjectionPlot";
import { Link } from "react-router-dom";

// Simulazione: retta fissa 3x + 4y - 5 = 0; muovendo il punto P si vede la
// proiezione H e la distanza cambiare.

export function ProiezioniSim() {
  const [px, setPx] = useState(2);
  const [py, setPy] = useState(3);
  const a = 3, b = 4, c = -5;
  const dist = Math.abs(a * px + b * py + c) / Math.sqrt(a * a + b * b);

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Retta fissa <b>3x + 4y − 5 = 0</b>. Muovi il punto <b>P</b>: la proiezione <b>H</b> scorre
        lungo la retta e la <b>distanza</b> cambia (è minima lungo la perpendicolare).
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <LineProjectionPlot a={a} b={b} c={c} point={[px, py]} />
        <div style={{ minWidth: 200 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ margin: 0 }}>P = ({px}, {py})</p>
            <p style={{ margin: "0.3rem 0 0", fontWeight: 600 }}>distanza = {Math.round(dist * 1000) / 1000}</p>
          </div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Px = {px}
            <input type="range" min={-4} max={6} step={1} value={px} onChange={(e) => setPx(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Py = {py}
            <input type="range" min={-4} max={6} step={1} value={py} onChange={(e) => setPy(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
            Versione completa (retta, piano, metodo vettoriale) nel <Link to="/calcolatore">Calcolatore</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
