import { Formula } from "../../components/Formula";
import { SectionShell } from "../../components/section/SectionShell";
import { TransformSim } from "../../components/sim/TransformSim";
import type { Exercise } from "../../components/section/ExerciseSet";

const esercizi: Exercise[] = [
  { level: "Facile", prompt: (<span>Se A è 2×3 e B è 3×4, quante colonne ha il prodotto AB?</span>), expected: [4], solutionText: "4 (AB è 2×4)", placeholder: "es. 4", hints: ["Il prodotto ha le righe di A e le colonne di B."] },
  { level: "Facile", prompt: (<span>Calcola l'elemento in posizione (1,1) di <Formula tex="\begin{pmatrix}1&2\\0&1\end{pmatrix}\begin{pmatrix}3&1\\2&0\end{pmatrix}" />.</span>), expected: [7], solutionText: "7", placeholder: "es. 7", hints: ["Riga 1 di A per colonna 1 di B.", "1·3 + 2·2."] },
  { level: "Medio", prompt: (<span>Il determinante di <Formula tex="\begin{pmatrix}2&1\\3&4\end{pmatrix}" /> (serve per l'inversa). Quanto vale?</span>), expected: [5], solutionText: "5", placeholder: "es. 5", hints: ["ad − bc.", "2·4 − 1·3."] },
  { level: "Medio", prompt: (<span>L'elemento (2,1) della trasposta di <Formula tex="\begin{pmatrix}1&2\\3&4\end{pmatrix}" />?</span>), expected: [2], solutionText: "2", placeholder: "es. 2", hints: ["La trasposta scambia righe e colonne: (Aᵀ)₂₁ = A₁₂."] },
  { level: "Difficile", prompt: (<span>Calcola il primo elemento (1,1) del prodotto riga-colonna <Formula tex="(1, 0, 2)\cdot(3, 5, 1)^T" /> (prodotto scalare).</span>), expected: [5], solutionText: "5", placeholder: "es. 5", hints: ["1·3 + 0·5 + 2·1."] },
  { level: "Difficile", prompt: (<span>Per una matrice diagonale diag(2, 5), l'inversa è diag(1/2, ?). Qual è il secondo valore?</span>), expected: [1 / 5], solutionText: "1/5", placeholder: "es. 1/5", hints: ["L'inversa di una diagonale ha i reciproci sulla diagonale."] },
];

function Teoria() {
  return (
    <>

      <div className="card">
        <h2>Definizioni</h2>
        <p>
          Una matrice <Formula tex="m \times n" /> è una tabella di numeri con m righe e n colonne:
        </p>
        <Formula block tex="A = \begin{pmatrix} a_{11} & \dots & a_{1n} \\ \vdots & \ddots & \vdots \\ a_{m1} & \dots & a_{mn} \end{pmatrix}" />
        <p>
          Se m = n la matrice è <b>quadrata</b> (ordine n). La diagonale principale è formata dagli
          elementi <Formula tex="a_{ii}" />. La matrice <b>identità</b> <Formula tex="I_n" /> ha 1
          sulla diagonale e 0 altrove ed è l'elemento neutro del prodotto.
        </p>
      </div>

      <div className="card">
        <h2>Somma e prodotto per scalare</h2>
        <Formula block tex="(A+B)_{ij} = a_{ij} + b_{ij} \qquad (kA)_{ij} = k\,a_{ij}" />
        <p>Si opera elemento per elemento; richiedono matrici delle stesse dimensioni.</p>
      </div>

      <div className="card">
        <h2>Prodotto righe per colonne</h2>
        <p>
          Il prodotto <Formula tex="AB" /> è definito solo se il numero di colonne di A è uguale al
          numero di righe di B. Se A è <Formula tex="m\times p" /> e B è <Formula tex="p \times n" />,
          allora <Formula tex="AB" /> è <Formula tex="m \times n" /> con
        </p>
        <Formula block tex="(AB)_{ij} = \sum_{k=1}^{p} a_{ik}\,b_{kj}" />
        <p>
          Ogni elemento è il prodotto scalare tra la riga i di A e la colonna j di B.{" "}
          <b>Non è commutativo</b>: in generale <Formula tex="AB \neq BA" />.
        </p>
      </div>

      <div className="card">
        <h2>Proprietà</h2>
        <ul>
          <li>Associativa: <Formula tex="(AB)C = A(BC)" /></li>
          <li>Distributiva: <Formula tex="A(B+C) = AB+AC" /></li>
          <li>Non commutativa in generale, non vale la legge di annullamento del prodotto: <Formula tex="AB=0" /> non implica <Formula tex="A=0" /> o <Formula tex="B=0" /></li>
          <li>Trasposta: <Formula tex="(A^T)_{ij} = a_{ji}" />, con <Formula tex="(AB)^T = B^T A^T" /></li>
        </ul>
      </div>

      <div className="card">
        <h2>Matrice inversa</h2>
        <p>
          Una matrice quadrata A è <b>invertibile</b> se esiste <Formula tex="A^{-1}" /> tale che{" "}
          <Formula tex="AA^{-1} = A^{-1}A = I" />. Questo accade se e solo se{" "}
          <Formula tex="\det A \neq 0" />. Per una matrice 2×2:
        </p>
        <Formula block tex="A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}, \qquad A^{-1} = \frac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />
        <p>
          Per matrici più grandi si usa il metodo di <b>Gauss-Jordan</b>: si affianca A alla
          matrice identità <Formula tex="[A \mid I]" /> e si riduce A a I con operazioni elementari
          sulle righe; quello che rimane a destra è <Formula tex="A^{-1}" />. Puoi vedere tutti i
          passaggi nel <b>Calcolatore</b>.
        </p>
      </div>

      <div className="card">
        <h2>Esempio svolto: prodotto di matrici</h2>
        <Formula block tex="A=\begin{pmatrix}1&2\\0&1\end{pmatrix},\quad B=\begin{pmatrix}3&1\\2&0\end{pmatrix}" />
        <Formula block tex="AB = \begin{pmatrix}1\cdot3+2\cdot2 & 1\cdot1+2\cdot0\\0\cdot3+1\cdot2 & 0\cdot1+1\cdot0\end{pmatrix}=\begin{pmatrix}7&1\\2&0\end{pmatrix}" />
        <Formula block tex="BA = \begin{pmatrix}3\cdot1+1\cdot0 & 3\cdot2+1\cdot1\\2\cdot1+0\cdot0 & 2\cdot2+0\cdot1\end{pmatrix}=\begin{pmatrix}3&7\\2&4\end{pmatrix}" />
        <p>Come si vede, <Formula tex="AB \neq BA" />: il prodotto tra matrici non è commutativo.</p>
      </div>
    </>
  );
}

export function Matrici() {
  return (
    <SectionShell
      pill="Teoria · 3"
      title="Matrici"
      teoria={<Teoria />}
      simulazione={<TransformSim />}
      esercizi={esercizi}
      quizTopic="Matrici"
    />
  );
}
