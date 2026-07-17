import { useEffect, useState } from "react";
import { questions, type Question } from "../data/quiz";

const TOPICS = Array.from(new Set(questions.map((q) => q.topic)));
const COMPLETE_COUNT = 20;
const COMPLETE_LIMIT = 30 * 60; // 30 minuti in secondi

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface RunQuestion {
  q: Question;
  options: string[];
  correctIndex: number;
}

// Prepara le domande della sessione mescolando anche l'ordine delle opzioni,
// così la posizione della risposta corretta è casuale.
function buildRun(qs: Question[]): RunQuestion[] {
  return qs.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return {
      q,
      options: order.map((i) => q.options[i]),
      correctIndex: order.indexOf(q.correct),
    };
  });
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Screen = "home" | "running" | "results";

export function Quiz() {
  const [screen, setScreen] = useState<Screen>("home");
  const [run, setRun] = useState<RunQuestion[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [title, setTitle] = useState("");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  // Timer: attivo solo mentre si sta svolgendo il quiz.
  useEffect(() => {
    if (screen !== "running") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [screen]);

  // Quiz completo: chiusura automatica allo scadere dei 30 minuti.
  useEffect(() => {
    if (screen === "running" && isComplete && elapsed >= COMPLETE_LIMIT) {
      setFinalTime(COMPLETE_LIMIT);
      setScreen("results");
    }
  }, [elapsed, screen, isComplete]);

  function startSection(topic: string) {
    setRun(buildRun(shuffle(questions.filter((q) => q.topic === topic))));
    setIsComplete(false);
    setTitle(topic);
    begin();
  }

  function startComplete() {
    setRun(buildRun(shuffle(questions).slice(0, COMPLETE_COUNT)));
    setIsComplete(true);
    setTitle("Quiz completo");
    begin();
  }

  function begin() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setElapsed(0);
    setScreen("running");
  }

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === run[current].correctIndex) setScore((s) => s + 1);
  }

  function next() {
    if (current + 1 >= run.length) {
      setFinalTime(elapsed);
      setScreen("results");
      return;
    }
    setSelected(null);
    setCurrent((c) => c + 1);
  }

  // ---------------- Schermata iniziale ----------------
  if (screen === "home") {
    return (
      <div>
        <span className="pill">Pratica</span>
        <h1>Quiz</h1>

        <div className="card" style={{ borderColor: "var(--accent)" }}>
          <h2 style={{ marginTop: 0 }}>Quiz completo</h2>
          <p style={{ color: "var(--text-muted)" }}>
            {COMPLETE_COUNT} domande pescate da tutti gli argomenti · timer di 30 minuti · punteggio
            finale. Allo scadere del tempo il quiz si chiude automaticamente.
          </p>
          <button className="btn" onClick={startComplete}>
            Inizia il quiz completo
          </button>
        </div>

        <h2 style={{ marginTop: "1.5rem" }}>Quiz per sezione</h2>
        <p style={{ color: "var(--text-muted)" }}>
          10 domande sull'argomento scelto, con cronometro ed esito finale.
        </p>
        <div className="topic-grid">
          {TOPICS.map((t) => (
            <button
              key={t}
              className="topic-card"
              style={{ cursor: "pointer", textAlign: "left", font: "inherit" }}
              onClick={() => startSection(t)}
            >
              <h3>{t}</h3>
              <p>10 domande · cronometro</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------- Schermata risultati ----------------
  if (screen === "results") {
    const total = run.length;
    const timedOut = isComplete && finalTime >= COMPLETE_LIMIT;
    const percent = Math.round((score / total) * 100);
    return (
      <div>
        <span className="pill">Pratica</span>
        <h1>Risultato</h1>
        <div className="card">
          <p className="pill">{title}</p>
          {timedOut && (
            <p style={{ color: "var(--danger)", fontWeight: 600 }}>Tempo scaduto!</p>
          )}
          <h2 style={{ marginTop: 0 }}>
            Hai risposto correttamente a {score} domande su {total} nel tempo{" "}
            {formatTime(finalTime)}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>Percentuale: {percent}%</p>
          <div className="btn-row">
            <button
              className="btn"
              onClick={() => (isComplete ? startComplete() : startSection(title))}
            >
              Riprova
            </button>
            <button className="btn secondary" onClick={() => setScreen("home")}>
              Torna ai quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- Schermata svolgimento ----------------
  const rq = run[current];
  const isCorrect = selected === rq.correctIndex;
  const remaining = COMPLETE_LIMIT - elapsed;
  const lowTime = isComplete && remaining <= 60;

  return (
    <div>
      <span className="pill">Pratica</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
        <h1 style={{ margin: 0 }}>{title}</h1>
        <span
          className="mono"
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: lowTime ? "var(--danger)" : "var(--accent)",
          }}
        >
          {isComplete ? `Tempo rimasto: ${formatTime(Math.max(0, remaining))}` : `Tempo: ${formatTime(elapsed)}`}
        </span>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Domanda {current + 1} / {run.length} · Corrette finora: {score}
        </p>
        <h3>{rq.q.prompt}</h3>

        {rq.options.map((opt, i) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (i === rq.correctIndex) cls += " correct";
            else if (i === selected) cls += " incorrect";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)}>
              {opt}
            </button>
          );
        })}

        {selected !== null && (
          <div className={`result-box ${isCorrect ? "" : "error"}`}>
            <p style={{ fontWeight: 600 }}>{isCorrect ? "Corretto!" : "Non corretto"}</p>
            <p>{rq.q.explanation}</p>
          </div>
        )}

        <div className="btn-row">
          <button className="btn" onClick={next} disabled={selected === null}>
            {current + 1 >= run.length ? "Vedi risultato" : "Prossima domanda"}
          </button>
          <button className="btn secondary" onClick={() => setScreen("home")}>
            Esci
          </button>
        </div>
      </div>
    </div>
  );
}
