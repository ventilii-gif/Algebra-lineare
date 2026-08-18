import { useState, type ReactNode } from "react";

function parseScalar(t: string): number | null {
  const s = t.trim();
  if (!s) return null;
  if (s.includes("/")) {
    const [a, b] = s.split("/");
    const an = parseFloat(a.replace(",", "."));
    const bn = parseFloat(b.replace(",", "."));
    return bn ? an / bn : null;
  }
  const v = parseFloat(s.replace(",", "."));
  return Number.isNaN(v) ? null : v;
}

// Interpreta la risposta come vettore di n componenti (n=1 → scalare).
function parseVec(input: string, n: number): number[] | null {
  const t = input.trim().replace(/[()[\]]/g, "");
  if (n === 1) {
    const v = parseScalar(t);
    return v === null ? null : [v];
  }
  const parts = t.split(/[,;]+/).map((x) => x.trim()).filter((x) => x.length > 0);
  if (parts.length !== n) return null;
  const nums = parts.map(parseScalar);
  if (nums.some((x) => x === null)) return null;
  return nums as number[];
}

export interface Exercise {
  level: "Facile" | "Medio" | "Difficile";
  prompt: ReactNode;
  expected: number[]; // risposta attesa (una componente = scalare)
  solutionText: string; // soluzione mostrata
  hints: string[];
  placeholder?: string;
}

const OK_MSG = ["Bravo! 🎉", "Esatto! 👏", "Perfetto! ⭐", "Ottimo lavoro! 💪"];
const NO_MSG = ["Non ci siamo, ma sei sulla buona strada. Prova un suggerimento!", "Riprova: controlla i calcoli. C'è un suggerimento se ti serve.", "Quasi! Dai un'occhiata al suggerimento e ritenta."];

function Row({ ex, index }: { ex: Exercise; index: number }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "no">("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [msg, setMsg] = useState("");

  function verify() {
    const got = parseVec(value, ex.expected.length);
    const ok = !!got && got.every((g, i) => Math.abs(g - ex.expected[i]) < 1e-9);
    setStatus(ok ? "ok" : "no");
    setMsg(ok ? OK_MSG[index % OK_MSG.length] : NO_MSG[index % NO_MSG.length]);
  }

  return (
    <div className="card">
      <span className="pill">{ex.level}</span>
      <div style={{ marginBottom: "0.6rem" }}>{ex.prompt}</div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="matrix-cell"
          style={{ width: "10rem" }}
          value={value}
          placeholder={ex.placeholder ?? "risposta"}
          onChange={(e) => {
            setValue(e.target.value);
            setStatus("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && verify()}
        />
        <button className="btn" onClick={verify}>Verifica</button>
        {hintsShown < ex.hints.length && (
          <button className="btn secondary" onClick={() => setHintsShown((h) => h + 1)}>
            Suggerimento
          </button>
        )}
        <button className="btn secondary" onClick={() => setShowSol((s) => !s)}>
          {showSol ? "Nascondi soluzione" : "Mostra soluzione"}
        </button>
      </div>

      {status !== "idle" && (
        <div className={`result-box ${status === "no" ? "error" : ""}`}>
          <p style={{ fontWeight: 600, margin: 0 }}>{msg}</p>
        </div>
      )}

      {hintsShown > 0 && (
        <div style={{ marginTop: "0.6rem" }}>
          {ex.hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} style={{ color: "var(--text-muted)", margin: "0.2rem 0", fontSize: "0.92rem" }}>
              💡 {h}
            </p>
          ))}
        </div>
      )}

      {showSol && (
        <div className="result-box">
          <p style={{ margin: 0 }}>Soluzione: <b>{ex.solutionText}</b></p>
        </div>
      )}
    </div>
  );
}

export function ExerciseSet({ exercises }: { exercises: Exercise[] }) {
  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Esercizi in ordine di difficoltà. Scrivi la tua risposta e premi <b>Verifica</b>. Se serve,
        chiedi un <b>Suggerimento</b> alla volta. Per i vettori separa le componenti con la virgola
        (es. <code>5,5</code>); per le frazioni usa <code>/</code> (es. <code>1/2</code>).
      </p>
      {exercises.map((ex, i) => (
        <Row key={i} ex={ex} index={i} />
      ))}
    </div>
  );
}
