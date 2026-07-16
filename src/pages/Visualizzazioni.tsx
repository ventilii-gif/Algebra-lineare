import { useMemo, useState } from "react";
import { VectorPlane } from "../components/VectorPlane";

type Mode = "somma" | "trasformazione";

export function Visualizzazioni() {
  const [mode, setMode] = useState<Mode>("somma");

  return (
    <div>
      <span className="pill">Pratica</span>
      <h1>Visualizzazioni</h1>

      <div className="tab-row">
        <button className={`tab-btn ${mode === "somma" ? "active" : ""}`} onClick={() => setMode("somma")}>
          Somma e prodotto scalare
        </button>
        <button className={`tab-btn ${mode === "trasformazione" ? "active" : ""}`} onClick={() => setMode("trasformazione")}>
          Trasformazione lineare
        </button>
      </div>

      {mode === "somma" ? <SommaView /> : <TrasformazioneView />}
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "0.3rem" }}>
      {label}{" "}
      <input
        className="matrix-cell"
        style={{ width: "4rem" }}
        type="number"
        step="0.5"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </label>
  );
}

function SommaView() {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  const [vx, setVx] = useState(1);
  const [vy, setVy] = useState(2);
  const [k, setK] = useState(1.5);

  const sum = { x: ux + vx, y: uy + vy };
  const scaled = { x: k * ux, y: k * uy };

  return (
    <div className="card">
      <p style={{ color: "var(--text-muted)" }}>
        Regola del parallelogramma: <b style={{ color: "#5b5bd6" }}>u</b> +{" "}
        <b style={{ color: "#d64545" }}>v</b> = <b style={{ color: "#1f9d55" }}>u+v</b>. Il vettore
        tratteggiato mostra <b style={{ color: "#c07a12" }}>k·u</b>.
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
        <VectorPlane
          vectors={[
            { x: ux, y: uy, color: "#5b5bd6", label: "u" },
            { x: vx, y: vy, color: "#d64545", label: "v" },
            { x: sum.x, y: sum.y, color: "#1f9d55", label: "u+v" },
            { x: scaled.x, y: scaled.y, color: "#c07a12", label: "k·u", dashed: true },
          ]}
          gridLines={[
            { from: [ux, uy], to: [sum.x, sum.y], color: "#d64545" },
            { from: [vx, vy], to: [sum.x, sum.y], color: "#5b5bd6" },
          ]}
        />
        <div>
          <p style={{ fontWeight: 600 }}>u</p>
          <NumField label="ux" value={ux} onChange={setUx} />
          <NumField label="uy" value={uy} onChange={setUy} />
          <p style={{ fontWeight: 600, marginTop: "0.8rem" }}>v</p>
          <NumField label="vx" value={vx} onChange={setVx} />
          <NumField label="vy" value={vy} onChange={setVy} />
          <p style={{ fontWeight: 600, marginTop: "0.8rem" }}>k</p>
          <NumField label="k" value={k} onChange={setK} />
        </div>
      </div>
    </div>
  );
}

function TrasformazioneView() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(0.5);
  const [c, setC] = useState(-0.5);
  const [d, setD] = useState(1);

  const apply = (x: number, y: number) => ({ x: a * x + b * y, y: c * x + d * y });

  const gridLines = useMemo(() => {
    const lines: { from: [number, number]; to: [number, number] }[] = [];
    for (let t = -3; t <= 3; t++) {
      const p1 = apply(t, -3);
      const p2 = apply(t, 3);
      lines.push({ from: [p1.x, p1.y], to: [p2.x, p2.y] });
      const q1 = apply(-3, t);
      const q2 = apply(3, t);
      lines.push({ from: [q1.x, q1.y], to: [q2.x, q2.y] });
    }
    return lines;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a, b, c, d]);

  const e1 = apply(1, 0);
  const e2 = apply(0, 1);
  const det = a * d - b * c;

  return (
    <div className="card">
      <p style={{ color: "var(--text-muted)" }}>
        La matrice A trasforma la base canonica: <b style={{ color: "#5b5bd6" }}>A·e1</b> e{" "}
        <b style={{ color: "#d64545" }}>A·e2</b>. La griglia deformata mostra come si trasforma
        l'intero piano. det(A) = {det.toFixed(2)} indica il fattore di scala dell'area (il segno
        indica se l'orientamento si inverte).
      </p>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
        <VectorPlane
          vectors={[
            { x: e1.x, y: e1.y, color: "#5b5bd6", label: "A·e1" },
            { x: e2.x, y: e2.y, color: "#d64545", label: "A·e2" },
          ]}
          gridLines={gridLines}
        />
        <div>
          <p style={{ fontWeight: 600 }}>
            A = [[a, b], [c, d]]
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", width: "9rem" }}>
            <NumField label="a" value={a} onChange={setA} />
            <NumField label="b" value={b} onChange={setB} />
            <NumField label="c" value={c} onChange={setC} />
            <NumField label="d" value={d} onChange={setD} />
          </div>
        </div>
      </div>
    </div>
  );
}
