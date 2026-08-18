import { Formula } from "../../components/Formula";
import { SectionShell } from "../../components/section/SectionShell";
import { EigenSim } from "../../components/sim/EigenSim";
import type { Exercise } from "../../components/section/ExerciseSet";

const esercizi: Exercise[] = [
  { level: "Facile", prompt: (<span>Autovalori della matrice diagonale <Formula tex="\begin{pmatrix}3&0\\0&5\end{pmatrix}" />? Scrivili separati da virgola.</span>), expected: [3, 5], solutionText: "3, 5", placeholder: "es. 3,5", hints: ["Per una diagonale sono gli elementi sulla diagonale."] },
  { level: "Facile", prompt: (<span>Per <Formula tex="A=\begin{pmatrix}2&1\\1&2\end{pmatrix}" />, la traccia (somma degli autovalori) vale?</span>), expected: [4], solutionText: "4", placeholder: "es. 4", hints: ["Traccia = somma diagonale = 2 + 2."] },
  { level: "Medio", prompt: (<span>Per <Formula tex="A=\begin{pmatrix}2&1\\1&2\end{pmatrix}" />, gli autovalori sono? (tr=4, det=3)</span>), expected: [1, 3], solutionText: "1 e 3", placeholder: "es. 1,3", hints: ["λ² − 4λ + 3 = 0.", "(λ−1)(λ−3)=0."] },
  { level: "Medio", prompt: (<span>Il prodotto degli autovalori di A è uguale a quale quantità? Rispondi con il valore per la matrice sopra (det = 3).</span>), expected: [3], solutionText: "3 (il determinante)", placeholder: "es. 3", hints: ["Prodotto autovalori = determinante."] },
  { level: "Difficile", prompt: (<span>Autovettore di <Formula tex="\begin{pmatrix}2&1\\1&2\end{pmatrix}" /> associato a λ=3? (una direzione, es. 1,1)</span>), expected: [1, 1], solutionText: "(1, 1)", placeholder: "es. 1,1", hints: ["Risolvi (A−3I)v=0.", "Le righe danno v1 = v2."] },
  { level: "Difficile", prompt: (<span>Per una matrice triangolare <Formula tex="\begin{pmatrix}5&7\\0&2\end{pmatrix}" />, il maggiore dei due autovalori è?</span>), expected: [5], solutionText: "5", placeholder: "es. 5", hints: ["Autovalori sulla diagonale: 5 e 2."] },
];

function Teoria() {
  return (
    <>

      <div className="card">
        <h2>Definizione</h2>
        <p>
          Dato un endomorfismo (o la sua matrice associata A, quadrata di ordine n), un vettore{" "}
          <Formula tex="\vec v \neq \vec 0" /> è un <b>autovettore</b> di A se esiste uno scalare{" "}
          <Formula tex="\lambda" /> (l'<b>autovalore</b> associato) tale che:
        </p>
        <Formula block tex="A\vec v = \lambda \vec v" />
        <p>
          Geometricamente: A applicata a <Formula tex="\vec v" /> restituisce un vettore parallelo
          a <Formula tex="\vec v" /> stesso (solo riscalato di <Formula tex="\lambda" />), invece
          di ruotarlo o deformarlo in una direzione diversa.
        </p>
      </div>

      <div className="card">
        <h2>Polinomio caratteristico</h2>
        <p>
          Riscrivendo <Formula tex="A\vec v = \lambda \vec v" /> come{" "}
          <Formula tex="(A - \lambda I)\vec v = \vec 0" />, questo sistema omogeneo ha soluzioni
          non nulle solo se la matrice <Formula tex="A - \lambda I" /> non è invertibile, cioè:
        </p>
        <Formula block tex="p(\lambda) = \det(A - \lambda I) = 0" />
        <p>
          <Formula tex="p(\lambda)" /> è il <b>polinomio caratteristico</b> di A, di grado n; le
          sue radici sono gli autovalori di A (reali o complessi, con eventuale molteplicità).
        </p>
        <p><b>Caso 2×2:</b></p>
        <Formula block tex="p(\lambda) = \lambda^2 - (\text{tr}\,A)\lambda + \det A" />
        <p><b>Caso 3×3:</b></p>
        <Formula block tex="p(\lambda) = -\lambda^3 + (\text{tr}\,A)\lambda^2 - (\text{somma minori princ. 2×2})\lambda + \det A" />
      </div>

      <div className="card">
        <h2>Calcolo degli autovettori</h2>
        <p>
          Per ogni autovalore <Formula tex="\lambda_i" />, gli autovettori associati sono le
          soluzioni non nulle del sistema omogeneo:
        </p>
        <Formula block tex="(A - \lambda_i I)\vec v = \vec 0" />
        <p>
          L'insieme di queste soluzioni (incluso il vettore nullo) è l'<b>autospazio</b>{" "}
          <Formula tex="V_{\lambda_i}" />, un sottospazio vettoriale la cui dimensione è la{" "}
          <b>molteplicità geometrica</b> di <Formula tex="\lambda_i" /> (sempre{" "}
          <Formula tex="\leq" /> alla molteplicità algebrica, cioè quella come radice del
          polinomio).
        </p>
      </div>

      <div className="card">
        <h2>Diagonalizzazione</h2>
        <p>
          A è <b>diagonalizzabile</b> se esiste una base di autovettori, cioè se per ogni
          autovalore la molteplicità geometrica coincide con quella algebrica (e la somma delle
          molteplicità è n). In tal caso, detta P la matrice le cui colonne sono n autovettori
          indipendenti:
        </p>
        <Formula block tex="A = P D P^{-1}, \qquad D = \text{diag}(\lambda_1,\dots,\lambda_n)" />
        <p>Le matrici simmetriche reali sono sempre diagonalizzabili (con autovettori ortogonali).</p>
      </div>

      <div className="card">
        <h2>Esempio svolto</h2>
        <Formula block tex="A = \begin{pmatrix}2&1\\1&2\end{pmatrix}" />
        <p><Formula tex="\text{tr}\,A = 4" />, <Formula tex="\det A = 3" />, quindi:</p>
        <Formula block tex="\lambda^2 - 4\lambda + 3 = 0 \ \Rightarrow\ \lambda_1 = 3,\ \lambda_2 = 1" />
        <p>Per <Formula tex="\lambda_1 = 3" />:</p>
        <Formula block tex="(A-3I)\vec v = \begin{pmatrix}-1&1\\1&-1\end{pmatrix}\vec v = \vec 0 \ \Rightarrow\ v_1 = v_2 \ \Rightarrow\ \vec v_1 = (1,1)" />
        <p>Per <Formula tex="\lambda_2 = 1" />:</p>
        <Formula block tex="(A-I)\vec v = \begin{pmatrix}1&1\\1&1\end{pmatrix}\vec v = \vec 0 \ \Rightarrow\ v_1 = -v_2 \ \Rightarrow\ \vec v_2 = (1,-1)" />
        <p>
          Prova con matrici fino a 3×3 (anche con autovalori complessi o irrazionali) nel{" "}
          <b>Calcolatore</b>.
        </p>
      </div>
    </>
  );
}

export function Autovalori() {
  return (
    <SectionShell
      pill="Teoria · 6"
      title="Autovalori e autovettori"
      teoria={<Teoria />}
      simulazione={<EigenSim />}
      esercizi={esercizi}
      quizTopic="Autovalori e autovettori"
    />
  );
}
