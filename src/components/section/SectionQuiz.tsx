import { useMemo, useState } from "react";
import { questions, type Question } from "../../data/quiz";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const OK = ["Bravo! 🎉", "Esatto! ⭐", "Perfetto! 👏", "Grande! 💪", "Ottimo! 🙌"];
const NO = ["Non fa niente, si impara sbagliando!", "Ci sei quasi: leggi la spiegazione.", "Poco male, ora ti è più chiaro!"];

interface RunQ {
  q: Question;
  options: string[];
  correctIndex: number;
}

export function SectionQuiz({ topic }: { topic: string }) {
  const build = () =>
    shuffle(questions.filter((q) => q.topic === topic)).map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return { q, options: order.map((i) => q.options[i]), correctIndex: order.indexOf(q.correct) };
    });

  const [run, setRun] = useState<RunQ[]>(build);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const rq = run[current];
  const isCorrect = selected === rq?.correctIndex;
  const okMsg = useMemo(() => OK[Math.floor(Math.random() * OK.length)], [current, selected]);
  const noMsg = useMemo(() => NO[Math.floor(Math.random() * NO.length)], [current, selected]);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === rq.correctIndex) setScore((s) => s + 1);
  }
  function next() {
    if (current + 1 >= run.length) {
      setDone(true);
      return;
    }
    setSelected(null);
    setCurrent((c) => c + 1);
  }
  function restart() {
    setRun(build());
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  if (done) {
    const perc = Math.round((score / run.length) * 100);
    const msg = perc >= 80 ? "Fantastico, padroneggi l'argomento! 🌟" : perc >= 50 ? "Bel lavoro, ci sei quasi! Ripassa e riprova. 💪" : "Ottimo inizio: rivedi la teoria e riprova, migliorerai di sicuro! 🙂";
    return (
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Hai completato il quiz!</h3>
        <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Punteggio: {score} / {run.length} ({perc}%)</p>
        <p>{msg}</p>
        <button className="btn" onClick={restart}>Rifai il quiz</button>
      </div>
    );
  }

  return (
    <div className="card">
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        Domanda {current + 1} / {run.length} · Corrette: {score}
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
          <p style={{ fontWeight: 600 }}>{isCorrect ? okMsg : noMsg}</p>
          <p>{rq.q.explanation}</p>
        </div>
      )}

      <div className="btn-row">
        <button className="btn" onClick={next} disabled={selected === null}>
          {current + 1 >= run.length ? "Vedi risultato" : "Prossima domanda"}
        </button>
      </div>
    </div>
  );
}
