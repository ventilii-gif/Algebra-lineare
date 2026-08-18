import { useState } from "react";
import { VectorPlane } from "../VectorPlane";

// Simulazione: combinazione lineare λ1·v1 + λ2·v2. Muovendo i coefficienti si
// raggiunge (in genere) qualunque punto del piano: v1 e v2 generano ℝ².

export function LinearCombinationSim() {
  const [l1, setL1] = useState(1);
  const [l2, setL2] = useState(1);
  const v1 = { x: 2, y: 1 };
  const v2 = { x: -1, y: 2 };
  const w = { x: l1 * v1.x + l2 * v2.x, y: l1 * v1.y + l2 * v2.y };
  const det = v1.x * v2.y - v1.y * v2.x;

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Combinazione lineare <b>w = λ₁·v₁ + λ₂·v₂</b>. Muovi i coefficienti: se v₁ e v₂ sono
        indipendenti (non paralleli) puoi raggiungere qualunque punto del piano — cioè{" "}
        <b>generano ℝ²</b>.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <VectorPlane
          range={8}
          size={360}
          vectors={[
            { x: v1.x, y: v1.y, color: "#8a8a9a", label: "v1", dashed: true },
            { x: v2.x, y: v2.y, color: "#8a8a9a", label: "v2", dashed: true },
            { x: l1 * v1.x, y: l1 * v1.y, color: "#5b5bd6", label: "λ1·v1" },
            { x: l2 * v2.x, y: l2 * v2.y, color: "#d64545", label: "λ2·v2" },
            { x: w.x, y: w.y, color: "#1f9d55", label: "w" },
          ]}
          gridLines={[
            { from: [l1 * v1.x, l1 * v1.y], to: [w.x, w.y], color: "#d64545" },
            { from: [l2 * v2.x, l2 * v2.y], to: [w.x, w.y], color: "#5b5bd6" },
          ]}
        />
        <div style={{ minWidth: 200 }}>
          <div className="result-box" style={{ marginTop: 0 }}>
            <p style={{ margin: 0 }}>w = ({Math.round(w.x * 100) / 100}, {Math.round(w.y * 100) / 100})</p>
            <p style={{ margin: "0.3rem 0 0", color: "var(--text-muted)" }}>
              {det !== 0 ? "v1 e v2 sono indipendenti: generano tutto il piano." : "v1 e v2 sono paralleli: generano solo una retta."}
            </p>
          </div>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            λ₁ = {l1.toFixed(1)}
            <input type="range" min={-3} max={3} step={0.1} value={l1} onChange={(e) => setL1(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            λ₂ = {l2.toFixed(1)}
            <input type="range" min={-3} max={3} step={0.1} value={l2} onChange={(e) => setL2(Number(e.target.value))} style={{ width: "100%" }} />
          </label>
        </div>
      </div>
    </div>
  );
}
