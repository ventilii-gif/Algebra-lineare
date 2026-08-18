import { useState } from "react";
import { FramePlane2D } from "../FramePlane2D";
import { Link } from "react-router-dom";

// Simulazione: muovendo il punto P si vedono cambiare le sue coordinate nel
// nuovo riferimento (O'; i', j'). Nuovo riferimento fisso per semplicità.

export function CambioBaseSim() {
  const [px, setPx] = useState(3);
  const [py, setPy] = useState(2);

  const oP: [number, number] = [1, 0];
  const iP: [number, number] = [1, 1];
  const jP: [number, number] = [-1, 1];
  // B = [[1,-1],[1,1]], det = 2, B^-1 = 1/2 [[1,1],[-1,1]]
  const dx = px - oP[0];
  const dy = py - oP[1];
  const xNew = (dx + dy) / 2;
  const yNew = (-dx + dy) / 2;

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Riferimento nuovo fisso: O' = (1, 0), i' = (1, 1), j' = (−1, 1). Muovi il punto <b>P</b> e
        osserva come cambiano le sue coordinate <b>P'</b> nel nuovo riferimento.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <FramePlane2D oPrime={oP} iPrime={iP} jPrime={jP} point={[px, py]} pNew={[xNew, yNew]} />
        <div style={{ minWidth: 200 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ margin: 0 }}>P nel vecchio rif.: ({px}, {py})</p>
            <p style={{ margin: "0.3rem 0 0", fontWeight: 600 }}>P' nel nuovo rif.: ({Math.round(xNew * 100) / 100}, {Math.round(yNew * 100) / 100})</p>
          </div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Px = {px}
            <input type="range" min={-4} max={5} step={1} value={px} onChange={(e) => setPx(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Py = {py}
            <input type="range" min={-4} max={5} step={1} value={py} onChange={(e) => setPy(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.6rem" }}>
            Versione completa (1D/2D/3D, con passaggi) nel <Link to="/calcolatore">Calcolatore</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
