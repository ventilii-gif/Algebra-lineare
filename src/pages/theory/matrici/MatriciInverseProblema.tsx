import { useMemo, useState } from "react";
import { Formula } from "../../../components/Formula";
import { matchesAnswer } from "../../../components/section/ExerciseSet";

// ---------- utilità matriciali (numeri interi) ----------
type Mat = number[][];
const rint = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const nz1 = () => (Math.random() < 0.5 ? -1 : 1);

const det2 = (m: Mat) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
const inv2 = (m: Mat): Mat => {
  const d = det2(m);
  return [[m[1][1] / d, -m[0][1] / d], [-m[1][0] / d, m[0][0] / d]];
};
const det3 = (m: Mat) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const inv3 = (m: Mat): Mat => {
  const d = det3(m);
  const cof: Mat = [
    [m[1][1] * m[2][2] - m[1][2] * m[2][1], -(m[1][0] * m[2][2] - m[1][2] * m[2][0]), m[1][0] * m[2][1] - m[1][1] * m[2][0]],
    [-(m[0][1] * m[2][2] - m[0][2] * m[2][1]), m[0][0] * m[2][2] - m[0][2] * m[2][0], -(m[0][0] * m[2][1] - m[0][1] * m[2][0])],
    [m[0][1] * m[1][2] - m[0][2] * m[1][1], -(m[0][0] * m[1][2] - m[0][2] * m[1][0]), m[0][0] * m[1][1] - m[0][1] * m[1][0]],
  ];
  // inversa = (1/det) · adjugata, adjugata = trasposta dei cofattori
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => cof[j][i] / d));
};
const matmul = (A: Mat, B: Mat): Mat =>
  A.map((row) => B[0].map((_, j) => row.reduce((s, aik, k) => s + aik * B[k][j], 0)));

function identity(n: number): Mat {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
}
// matrice unimodulare (det = 1, inversa intera) tramite operazioni elementari
function unimodular(n: number, ops: number): Mat {
  const M = identity(n);
  for (let s = 0; s < ops; s++) {
    let i = rint(0, n - 1), j = rint(0, n - 1);
    while (j === i) j = rint(0, n - 1);
    const k = nz1();
    for (let c = 0; c < n; c++) M[i][c] += k * M[j][c];
  }
  return M;
}
function texMat(m: Mat): string {
  return `\\begin{pmatrix} ${m.map((r) => r.join(" & ")).join(" \\\\ ")} \\end{pmatrix}`;
}

interface Problem {
  M2: Mat;
  M3: Mat;
  R32: Mat;
  R23: Mat;
  inv2Flat: number[];
  Xflat: number[];
}

function makeProblem(): Problem {
  const M2 = unimodular(2, 3);
  const M3 = unimodular(3, 5);
  const R32: Mat = [0, 1, 2].map(() => [rint(-3, 3), rint(-3, 3)]);
  const R23: Mat = [0, 1].map(() => [rint(-3, 3), rint(-3, 3), rint(-3, 3)]);
  const inv2Flat = inv2(M2).flat();
  const Xflat = matmul(inv3(M3), R32).flat();
  return { M2, M3, R32, R23, inv2Flat, Xflat };
}

function Step({ level, question, expected, hints, steps, placeholder, resetKey }: {
  level: string;
  question: React.ReactNode;
  expected: number[];
  hints: string[];
  steps: string[];
  placeholder: string;
  resetKey: number;
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "no">("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [showSol, setShowSol] = useState(false);

  // reset quando cambia il problema
  useMemo(() => {
    setValue("");
    setStatus("idle");
    setHintsShown(0);
    setShowSol(false);
  }, [resetKey]);

  function verify() {
    setStatus(matchesAnswer(value, expected) ? "ok" : "no");
  }

  return (
    <div className="card" style={{ background: "var(--bg)" }}>
      <span className="pill">{level}</span>
      <div style={{ margin: "0.5rem 0" }}>{question}</div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input className="matrix-cell" style={{ width: "12rem" }} value={value} placeholder={placeholder}
          onChange={(e) => { setValue(e.target.value); setStatus("idle"); }}
          onKeyDown={(e) => e.key === "Enter" && verify()} />
        <button className="btn" onClick={verify}>Verifica</button>
        {hintsShown < hints.length && <button className="btn secondary" onClick={() => setHintsShown((h) => h + 1)}>Suggerimento</button>}
        <button className="btn secondary" onClick={() => setShowSol((s) => !s)}>{showSol ? "Nascondi svolgimento" : "Mostra svolgimento"}</button>
      </div>
      {status !== "idle" && (
        <div className={`result-box ${status === "no" ? "error" : ""}`}>
          <p style={{ fontWeight: 600, margin: 0 }}>{status === "ok" ? "Corretto! 🎉" : "Non ancora: riprova o usa un suggerimento."}</p>
        </div>
      )}
      {hintsShown > 0 && (
        <div style={{ marginTop: "0.5rem" }}>
          {hints.slice(0, hintsShown).map((h, i) => (<p key={i} style={{ color: "var(--text-muted)", margin: "0.2rem 0", fontSize: "0.9rem" }}>💡 {h}</p>))}
        </div>
      )}
      {showSol && (
        <div className="result-box">
          <div className="steps-list">{steps.join("\n")}</div>
        </div>
      )}
    </div>
  );
}

export function MatriciInverseProblema() {
  const [key, setKey] = useState(0);
  const prob = useMemo(makeProblem, [key]);
  const { M2, M3, R32, R23, inv2Flat, Xflat } = prob;

  return (
    <div style={{ marginTop: "1.5rem" }}>
      <h3>Problema guidato: inverse e sistema AX = B</h3>
      <div className="card">
        <p>Sono date quattro matrici:</p>
        <div style={{ display: "flex", gap: "1.2rem", flexWrap: "wrap", alignItems: "center" }}>
          <Formula block tex={`M_2 = ${texMat(M2)}`} />
          <Formula block tex={`M_3 = ${texMat(M3)}`} />
          <Formula block tex={`R_{32} = ${texMat(R32)}`} />
          <Formula block tex={`R_{23} = ${texMat(R23)}`} />
        </div>
        <div className="btn-row">
          <button className="btn secondary" onClick={() => setKey((k) => k + 1)}>Nuovo problema</button>
        </div>
      </div>

      <Step
        level="Facile"
        resetKey={key}
        question={<span>1) Quante delle quattro matrici sono invertibili?</span>}
        expected={[2]}
        placeholder="es. 2"
        hints={["Solo le matrici quadrate possono avere un'inversa.", "R₃₂ e R₂₃ non sono quadrate; M₂ e M₃ hanno determinante ±1 ≠ 0."]}
        steps={["R₃₂ (3×2) e R₂₃ (2×3) non sono quadrate → non invertibili.", "M₂ e M₃ sono quadrate con det = ±1 ≠ 0 → invertibili.", "Quindi le matrici invertibili sono 2."]}
      />

      <Step
        level="Medio"
        resetKey={key}
        question={<span>2) Calcola l'inversa <Formula tex="M_2^{-1}" />. Scrivi i 4 elementi in ordine: a₁₁, a₁₂, a₂₁, a₂₂.</span>}
        expected={inv2Flat}
        placeholder="es. 1,-2,0,1"
        hints={["Per una 2×2: A⁻¹ = 1/det · [[d, −b], [−c, a]].", `det(M₂) = ${det2(M2)}`]}
        steps={[`det(M₂) = ${det2(M2)}`, `M₂⁻¹ = 1/${det2(M2)} · [[${M2[1][1]}, ${-M2[0][1]}], [${-M2[1][0]}, ${M2[0][0]}]]`, `= (${inv2Flat.join(", ")})`]}
      />

      <Step
        level="Difficile"
        resetKey={key}
        question={<span>3) Scegliamo <Formula tex="A = M_3" /> e <Formula tex="B = R_{32}" /> (compatibili: A è 3×3, B è 3×2). Risolvi <Formula tex="AX = B" />, cioè <Formula tex="X = A^{-1}B" />. Scrivi X riga per riga (6 numeri).</span>}
        expected={Xflat}
        placeholder="es. 1,0,-2,3,1,-1"
        hints={["X ha le stesse dimensioni di B: 3×2.", "Prima calcola M₃⁻¹, poi moltiplica per R₃₂.", "AX = B con A invertibile ⇒ X = A⁻¹B."]}
        steps={["A è invertibile (det = ±1), quindi X = A⁻¹B.", "Calcola M₃⁻¹ e poi il prodotto M₃⁻¹ · R₃₂ (3×2).", `X = (${Xflat.join(", ")})  (in ordine: riga 1, riga 2, riga 3)`]}
      />

      <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
        Nota: R₃₂ e R₂₃, essendo rettangolari, non hanno inversa. Puoi però usarle come termine noto
        B: con A = M₂ (2×2) andrebbe scelta B = R₂₃ (2 righe), ottenendo X di dimensione 2×3.
        Verifica inverse e prodotti nel <b>Calcolatore</b>.
      </p>
    </div>
  );
}
