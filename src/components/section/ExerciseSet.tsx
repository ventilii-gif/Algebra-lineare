import { useEffect, useState, type ReactNode } from "react";

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

export function matchesAnswer(input: string, expected: number[]): boolean {
  const got = parseVec(input, expected.length);
  return !!got && got.every((g, i) => Math.abs(g - expected[i]) < 1e-6);
}

// Esercizio (istanza concreta), eventualmente generato a caso.
export interface GenExercise {
  prompt: ReactNode;
  expected: number[];
  solutionText: string;
  hints: string[];
  steps?: string[]; // svolgimento passo-passo
  placeholder?: string;
}

// Esercizio fisso (compatibile con l'uso esistente nelle pagine).
export interface Exercise extends GenExercise {
  level: "Facile" | "Medio" | "Difficile";
}

// Generatore di esercizi casuali.
export interface Generator {
  level: "Facile" | "Medio" | "Difficile";
  title: string;
  make: () => GenExercise;
}

const OK_MSG = ["Bravo! 🎉", "Esatto! 👏", "Perfetto! ⭐", "Ottimo lavoro! 💪"];
const NO_MSG = ["Non ci siamo, ma sei sulla buona strada. Prova un suggerimento!", "Riprova: controlla i calcoli. C'è un suggerimento se ti serve.", "Quasi! Dai un'occhiata al suggerimento e ritenta."];

// ---------- Progressi (localStorage) ----------
interface Progress {
  correct: number;
  attempts: number;
}
function loadProgress(topic: string): Progress {
  try {
    const all = JSON.parse(localStorage.getItem("alglin_progress") || "{}");
    return all[topic] ?? { correct: 0, attempts: 0 };
  } catch {
    return { correct: 0, attempts: 0 };
  }
}
function saveProgress(topic: string, p: Progress) {
  try {
    const all = JSON.parse(localStorage.getItem("alglin_progress") || "{}");
    all[topic] = p;
    localStorage.setItem("alglin_progress", JSON.stringify(all));
  } catch {
    /* ignora */
  }
}

interface RowProps {
  level: string;
  title?: string;
  make: () => GenExercise;
  random: boolean;
  index: number;
  onAnswer: (correct: boolean) => void;
}

function Row({ level, title, make, random, index, onAnswer }: RowProps) {
  const [ex, setEx] = useState<GenExercise>(make);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "no">("idle");
  const [hintsShown, setHintsShown] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const [msg, setMsg] = useState("");
  const [counted, setCounted] = useState(false);

  function reset(next?: GenExercise) {
    if (next) setEx(next);
    setValue("");
    setStatus("idle");
    setHintsShown(0);
    setShowSol(false);
    setMsg("");
    setCounted(false);
  }

  function verify() {
    const got = parseVec(value, ex.expected.length);
    const ok = !!got && got.every((g, i) => Math.abs(g - ex.expected[i]) < 1e-6);
    setStatus(ok ? "ok" : "no");
    setMsg(ok ? OK_MSG[index % OK_MSG.length] : NO_MSG[index % NO_MSG.length]);
    if (!counted) {
      onAnswer(ok);
      setCounted(true);
    }
  }

  return (
    <div className="card">
      <span className="pill">{level}</span>
      {title && <b style={{ marginLeft: "0.5rem" }}>{title}</b>}
      <div style={{ margin: "0.6rem 0" }}>{ex.prompt}</div>
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
          <button className="btn secondary" onClick={() => setHintsShown((h) => h + 1)}>Suggerimento</button>
        )}
        <button className="btn secondary" onClick={() => setShowSol((s) => !s)}>
          {showSol ? "Nascondi svolgimento" : "Mostra svolgimento"}
        </button>
        {random && (
          <button className="btn secondary" onClick={() => reset(make())}>Nuovo esercizio</button>
        )}
      </div>

      {status !== "idle" && (
        <div className={`result-box ${status === "no" ? "error" : ""}`}>
          <p style={{ fontWeight: 600, margin: 0 }}>{msg}</p>
        </div>
      )}

      {hintsShown > 0 && (
        <div style={{ marginTop: "0.6rem" }}>
          {ex.hints.slice(0, hintsShown).map((h, i) => (
            <p key={i} style={{ color: "var(--text-muted)", margin: "0.2rem 0", fontSize: "0.92rem" }}>💡 {h}</p>
          ))}
        </div>
      )}

      {showSol && (
        <div className="result-box">
          {ex.steps && ex.steps.length > 0 && (
            <div className="steps-list" style={{ marginBottom: "0.5rem" }}>{ex.steps.join("\n")}</div>
          )}
          <p style={{ margin: 0 }}>Soluzione: <b>{ex.solutionText}</b></p>
        </div>
      )}
    </div>
  );
}

interface Props {
  exercises?: Exercise[];
  generators?: Generator[];
  topic?: string;
}

export function ExerciseSet({ exercises = [], generators = [], topic = "" }: Props) {
  const [prog, setProg] = useState<Progress>({ correct: 0, attempts: 0 });

  useEffect(() => {
    setProg(loadProgress(topic));
  }, [topic]);

  function record(correct: boolean) {
    setProg((p) => {
      const next = { correct: p.correct + (correct ? 1 : 0), attempts: p.attempts + 1 };
      saveProgress(topic, next);
      return next;
    });
  }
  function resetProgress() {
    const zero = { correct: 0, attempts: 0 };
    setProg(zero);
    saveProgress(topic, zero);
  }

  const perc = prog.attempts ? Math.round((prog.correct / prog.attempts) * 100) : 0;

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Scrivi la risposta e premi <b>Verifica</b>. Chiedi un <b>Suggerimento</b> alla volta, oppure
        <b> Mostra svolgimento</b> per la correzione passo-passo. Per i vettori separa le componenti
        con la virgola (es. <code>5,5</code>); per le frazioni usa <code>/</code> (es. <code>1/2</code>).
      </p>

      {topic && (
        <div className="card" style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>I tuoi progressi: {prog.correct} corretti su {prog.attempts} tentativi ({perc}%)</p>
            <div style={{ height: 8, background: "var(--border)", borderRadius: 999, marginTop: "0.4rem", overflow: "hidden" }}>
              <div style={{ width: `${perc}%`, height: "100%", background: "var(--success)" }} />
            </div>
          </div>
          <button className="btn secondary" onClick={resetProgress}>Azzera progressi</button>
        </div>
      )}

      {generators.length > 0 && (
        <>
          <h3 style={{ marginTop: "1.2rem" }}>Esercizi generati a caso</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 0 }}>Premi «Nuovo esercizio» per allenarti con valori sempre diversi.</p>
          {generators.map((g, i) => (
            <Row key={`g${i}`} level={g.level} title={g.title} make={g.make} random index={i} onAnswer={record} />
          ))}
        </>
      )}

      {exercises.length > 0 && (
        <>
          {generators.length > 0 && <h3 style={{ marginTop: "1.2rem" }}>Esercizi guidati</h3>}
          {exercises.map((ex, i) => (
            <Row key={`f${i}`} level={ex.level} make={() => ex} random={false} index={i} onAnswer={record} />
          ))}
        </>
      )}
    </div>
  );
}
