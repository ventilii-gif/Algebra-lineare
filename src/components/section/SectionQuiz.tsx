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
  const build = (): RunQ[] =>
    shuffle(questions.filter((q) => q.topic === topic)).map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return { q, options: order.map((i) => q.options[i]), correctIndex: order.indexOf(q.correct) };
    });

  const [run, setRun] = useState<RunQ[]>(build);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => run.map(() => null));
  const [done, setDone] = useState(false);

  const rq = run[current];
  const selected = answers[current];
  const isCorrect = selected === rq?.correctIndex;
  // messaggi stabili finché non cambia domanda o risposta
  const okMsg = useMemo(() => OK[Math.floor(Math.random() * OK.length)], [current, selected]);
  const noMsg = useMemo(() => NO[Math.floor(Math.random() * NO.length)], [current, selected]);

  const score = answers.reduce<number>((s, a, i) => s + (a !== null && a === run[i].correctIndex ? 1 : 0), 0);
  const answeredCount = answers.filter((a) => a !== null).length;

  function choose(i: number) {
    if (answers[current] !== null) return; // bloccata dopo la risposta
    setAnswers((prev) => prev.map((a, k) => (k === current ? i : a)));
  }
  function restart() {
    const r = build();
    setRun(r);
    setAnswers(r.map(() => null));
    setCurrent(0);
    setDone(false);
  }

  if (done) {
    const perc = Math.round((score / run.length) * 100);
    const msg = perc >= 80 ? "Fantastico, padroneggi l'argomento! 🌟" : perc >= 50 ? "Bel lavoro, ci sei quasi! Ripassa e riprova. 💪" : "Ottimo inizio: rivedi la teoria e riprova, migliorerai di sicuro! 🙂";
    return (
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Quiz terminato!</h3>
        <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          Punteggio: {score} / {run.length} ({perc}%)
        </p>
        <p style={{ color: "var(--text-muted)" }}>Domande risposte: {answeredCount} su {run.length}</p>
        <p>{msg}</p>
        <button className="btn" onClick={restart}>Rifai il quiz</button>
      </div>
    );
  }

  return (
    <div className="card">
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
        Domanda {current + 1} / {run.length} · Corrette: {score} · Risposte: {answeredCount}
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
        <button className="btn secondary" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>
          Precedente
        </button>
        {current + 1 < run.length ? (
          <button className="btn" onClick={() => setCurrent((c) => Math.min(run.length - 1, c + 1))}>
            Prossima
          </button>
        ) : (
          <button className="btn" onClick={() => setDone(true)}>Vedi risultato</button>
        )}
        <button className="btn secondary" onClick={() => setDone(true)}>
          Termina ora
        </button>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: "0.4rem" }}>
        Puoi tornare indietro con «Precedente» o chiudere in anticipo con «Termina ora»: vedrai
        comunque il punteggio finale.
      </p>
    </div>
  );
}
