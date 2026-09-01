import { useState, type ReactNode } from "react";
import { ExerciseSet, type Exercise } from "./ExerciseSet";
import { SectionQuiz } from "./SectionQuiz";
import { generatorsByTopic } from "../../data/generators";

type Sub = "teoria" | "simulazione" | "esercizi" | "quiz";

const subs: { id: Sub; label: string }[] = [
  { id: "teoria", label: "Teoria" },
  { id: "simulazione", label: "Simulazione" },
  { id: "esercizi", label: "Esercizi" },
  { id: "quiz", label: "Quiz" },
];

interface Props {
  pill: string;
  title: string;
  teoria: ReactNode;
  simulazione: ReactNode;
  esercizi: Exercise[];
  quizTopic: string;
}

export function SectionShell({ pill, title, teoria, simulazione, esercizi, quizTopic }: Props) {
  const [sub, setSub] = useState<Sub>("teoria");
  return (
    <div>
      <span className="pill">{pill}</span>
      <h1>{title}</h1>
      <div className="tab-row">
        {subs.map((s) => (
          <button key={s.id} className={`tab-btn ${sub === s.id ? "active" : ""}`} onClick={() => setSub(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      {sub === "teoria" && <div>{teoria}</div>}
      {sub === "simulazione" && <div>{simulazione}</div>}
      {sub === "esercizi" && (
        <ExerciseSet exercises={esercizi} generators={generatorsByTopic[quizTopic] ?? []} topic={quizTopic} />
      )}
      {sub === "quiz" && <SectionQuiz topic={quizTopic} />}
    </div>
  );
}
