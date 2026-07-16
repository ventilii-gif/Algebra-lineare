import { Formula } from "../../components/Formula";

export function Matrici() {
  return (
    <div>
      <span className="pill">Teoria · 3</span>
      <h1>Matrici</h1>

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
    </div>
  );
}
