import { useMemo, useState } from "react";
import { questions } from "../data/quiz";

const topics = ["Tutti", ...Array.from(new Set(questions.map((q) => q.topic)))];

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

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setAnswered((a) => a + 1);
    if (i === q.correct) setScore((s) => s + 1);
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

        {q.options.map((opt, i) => {
          let cls = "quiz-option";
          if (selected !== null) {
            if (i === q.correct) cls += " correct";
            else if (i === selected) cls += " incorrect";
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)}>
              {opt}
            </button>
          );
        })}

        {selected !== null && (
          <div className={`result-box ${selected === q.correct ? "" : "error"}`}>
            <p style={{ fontWeight: 600 }}>{selected === q.correct ? "Corretto!" : "Non corretto"}</p>
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
