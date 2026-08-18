import { Formula } from "../../components/Formula";
import { SectionShell } from "../../components/section/SectionShell";
import { DeterminantSim } from "../../components/sim/DeterminantSim";
import type { Exercise } from "../../components/section/ExerciseSet";

const esercizi: Exercise[] = [
  { level: "Facile", prompt: (<span>Calcola <Formula tex="\det\begin{pmatrix}2&1\\3&4\end{pmatrix}" />.</span>), expected: [5], solutionText: "5", placeholder: "es. 5", hints: ["ad − bc.", "2·4 − 1·3."] },
  { level: "Facile", prompt: (<span>Calcola <Formula tex="\det\begin{pmatrix}1&2\\3&4\end{pmatrix}" />.</span>), expected: [-2], solutionText: "-2", placeholder: "es. -2", hints: ["1·4 − 2·3."] },
  { level: "Medio", prompt: (<span>Determinante della matrice diagonale diag(2, 3, 4)?</span>), expected: [24], solutionText: "24", placeholder: "es. 24", hints: ["Prodotto degli elementi diagonali.", "2·3·4."] },
  { level: "Medio", prompt: (<span>Una matrice ha due righe uguali: quanto vale il determinante?</span>), expected: [0], solutionText: "0", placeholder: "es. 0", hints: ["Righe dipendenti ⇒ det = 0."] },
  { level: "Difficile", prompt: (<span>Calcola <Formula tex="\det\begin{pmatrix}2&0&1\\1&3&4\\-1&2&0\end{pmatrix}" /> (sviluppo di Laplace).</span>), expected: [-11], solutionText: "-11", placeholder: "es. -11", hints: ["Sviluppa lungo una riga.", "Il risultato è −11."] },
  { level: "Difficile", prompt: (<span>Se <Formula tex="\det A = 3" /> e <Formula tex="\det B = 2" />, quanto vale <Formula tex="\det(AB)" />?</span>), expected: [6], solutionText: "6", placeholder: "es. 6", hints: ["det(AB) = det A · det B."] },
];

function Teoria() {
  return (
    <>

      <div className="card">
        <h2>Significato geometrico</h2>
        <p>
          Il determinante di una matrice 2×2 rappresenta l'<b>area con segno</b> del
          parallelogramma generato dalle sue righe (o colonne); quello di una 3×3 rappresenta il{" "}
          <b>volume con segno</b> del parallelepipedo generato dai tre vettori riga. Il segno
          indica l'orientamento (antiorario/orario, destrorso/sinistrorso).
        </p>
      </div>

      <div className="card">
        <h2>Ordine 2</h2>
        <Formula block tex="\det\begin{pmatrix}a&b\\c&d\end{pmatrix} = ad - bc" />
      </div>

      <div className="card">
        <h2>Ordine 3 — Regola di Sarrus</h2>
        <Formula block tex="\det\begin{pmatrix}a_{11}&a_{12}&a_{13}\\a_{21}&a_{22}&a_{23}\\a_{31}&a_{32}&a_{33}\end{pmatrix}" />
        <Formula block tex="= a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32} - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33}" />
        <p>Si sommano i prodotti delle diagonali "discendenti" e si sottraggono quelli delle diagonali "ascendenti" (funziona solo per l'ordine 3).</p>
      </div>

      <div className="card">
        <h2>Sviluppo di Laplace (ordine qualsiasi)</h2>
        <p>Sviluppando lungo la riga i:</p>
        <Formula block tex="\det A = \sum_{j=1}^{n} (-1)^{i+j}\, a_{ij}\, \det(M_{ij})" />
        <p>
          dove <Formula tex="M_{ij}" /> è il <b>minore complementare</b> ottenuto cancellando la
          riga i e la colonna j. Conviene sviluppare lungo la riga o colonna con più zeri.
        </p>
      </div>

      <div className="card">
        <h2>Proprietà utili</h2>
        <ul>
          <li><Formula tex="\det(A^T) = \det A" /></li>
          <li><Formula tex="\det(AB) = \det A \cdot \det B" /></li>
          <li>Scambiando due righe (o colonne), il determinante cambia segno</li>
          <li>Se una riga è combinazione lineare delle altre (o è nulla), <Formula tex="\det A = 0" /></li>
          <li>Sommare a una riga un multiplo di un'altra non cambia il determinante</li>
          <li><Formula tex="\det A \neq 0 \iff A" /> è invertibile <Formula tex="\iff" /> le righe (e colonne) di A sono linearmente indipendenti</li>
        </ul>
      </div>

      <div className="card">
        <h2>Esempio svolto (ordine 3, con Laplace su una riga con zero)</h2>
        <Formula block tex="\det\begin{pmatrix}2&0&1\\1&3&4\\ -1&2&0\end{pmatrix}" />
        <p>Sviluppo lungo la seconda riga (elementi 1, 3, 4):</p>
        <Formula block tex="= -1\cdot\begin{vmatrix}0&1\\2&0\end{vmatrix} + 3\cdot\begin{vmatrix}2&1\\-1&0\end{vmatrix} - 4\cdot\begin{vmatrix}2&0\\-1&2\end{vmatrix}" />
        <Formula block tex="= -1(0-2) + 3(0+1) - 4(4-0) = 2 + 3 - 16 = -11" />
        <p>Puoi verificare qualsiasi determinante, con passaggi completi, nella sezione <b>Calcolatore</b>.</p>
      </div>
    </>
  );
}

export function Determinanti() {
  return (
    <SectionShell
      pill="Teoria · 5"
      title="Determinanti"
      teoria={<Teoria />}
      simulazione={<DeterminantSim />}
      esercizi={esercizi}
      quizTopic="Determinanti"
    />
  );
}
