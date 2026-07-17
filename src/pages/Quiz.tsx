import { useMemo, useState } from "react";
import { questions, type Question } from "../data/quiz";

const topics = ["Tutti", ...Array.from(new Set(questions.map((q) => q.topic)))];

// Mescola l'ordine delle opzioni così la risposta corretta non è mai in
// posizione prevedibile. Restituisce le opzioni riordinate e l'indice in cui
// è finita la risposta corretta.
function shuffleQuestion(q: Question) {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correct),
  };
}

export function Quiz() {
  const [topic, setTopic] = useState("Tutti");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const pool = useMemo(
    () => (topic === "Tutti" ? questions : questions.filter((q) => q.topic === topic)),
    [topic]
  );
  const q = pool[index % pool.length];

  // Ricalcolato (quindi rimescolato) a ogni cambio di domanda, ma stabile
  // mentre si risponde alla domanda corrente.
  const shuffled = useMemo(() => shuffleQuestion(q), [q, index]);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setAnswered((a) => a + 1);
    if (i === shuffled.correctIndex) setScore((s) => s + 1);
  }

  function next() {
    setSelected(null);
    setIndex((i) => (i + 1) % pool.length);
  }

  function changeTopic(t: string) {
    setTopic(t);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswered(0);
  }

  const isCorrect = selected === shuffled.correctIndex;

  return (
    <div>
      <span className="pill">Pratica</span>
      <h1>Quiz</h1>

      <div className="btn-row">
        {topics.map((t) => (
          <button key={t} className={`tab-btn ${topic === t ? "active" : ""}`} onClick={() => changeTopic(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="card">
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Domanda {(index % pool.length) + 1} / {pool.length} · Punteggio: {score}/{answered}
        </p>
        <h3>{q.prompt}</h3>

        {shuffled.options.map((opt, i) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (i === shuffled.correctIndex) cls += " correct";
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
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="btn-row">
          <button className="btn" onClick={next} disabled={selected === null}>
            Prossima domanda
          </button>
        </div>
      </div>
    </div>
  );
}
