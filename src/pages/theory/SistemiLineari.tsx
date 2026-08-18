import { Formula } from "../../components/Formula";
import { SectionShell } from "../../components/section/SectionShell";
import { SystemSim } from "../../components/sim/SystemSim";
import type { Exercise } from "../../components/section/ExerciseSet";

const esercizi: Exercise[] = [
  { level: "Facile", prompt: (<span>Risolvi <Formula tex="\begin{cases}x+y=3\\ 2x-y=0\end{cases}" />. Scrivi (x, y).</span>), expected: [1, 2], solutionText: "(1, 2)", placeholder: "es. 1,2", hints: ["Somma le due equazioni per eliminare y.", "3x = 3 → x = 1."] },
  { level: "Facile", prompt: (<span>Un sistema omogeneo <Formula tex="A\vec x=\vec 0" /> ha sempre almeno una soluzione: quale? Scrivi (x, y).</span>), expected: [0, 0], solutionText: "(0, 0)", placeholder: "es. 0,0", hints: ["La soluzione banale."] },
  { level: "Medio", prompt: (<span>Se <Formula tex="\det A = -3" /> per un sistema 2×2, con Cramer <Formula tex="x=\frac{\det A_1}{\det A}" />: se <Formula tex="\det A_1 = -3" />, quanto vale x?</span>), expected: [1], solutionText: "1", placeholder: "es. 1", hints: ["(-3)/(-3)."] },
  { level: "Medio", prompt: (<span>Con <Formula tex="\text{rg}(A)=\text{rg}([A|b])=2" /> e 4 incognite, quanti parametri liberi ha la soluzione?</span>), expected: [2], solutionText: "2 (∞²)", placeholder: "es. 2", hints: ["n − rg(A) = 4 − 2."] },
  { level: "Difficile", prompt: (<span>Due rette parallele e distinte: quante soluzioni ha il sistema? (0 = nessuna, 1 = una, 2 = infinite)</span>), expected: [0], solutionText: "0 — nessuna soluzione (impossibile)", placeholder: "0/1/2", hints: ["Rette parallele non si incontrano."] },
  { level: "Difficile", prompt: (<span>Sistema omogeneo 2×2 con <Formula tex="\det A = 0" />: ha soluzioni non banali? (1 = sì, 0 = no)</span>), expected: [1], solutionText: "1 — sì, infinite", placeholder: "0 oppure 1", hints: ["det = 0 ⇒ rg < n ⇒ soluzioni non banali."] },
];

function Teoria() {
  return (
    <>

      <div className="card">
        <h2>Forma generale</h2>
        <p>Un sistema di m equazioni lineari in n incognite si scrive:</p>
        <Formula block tex="\begin{cases} a_{11}x_1 + \dots + a_{1n}x_n = b_1 \\ \vdots \\ a_{m1}x_1 + \dots + a_{mn}x_n = b_m \end{cases} \quad\Longleftrightarrow\quad A\vec x = \vec b" />
        <p>
          dove A è la matrice dei coefficienti (<Formula tex="m\times n" />), <Formula tex="\vec x" />{" "}
          il vettore delle incognite e <Formula tex="\vec b" /> il vettore dei termini noti. La
          matrice <Formula tex="[A \mid \vec b]" /> si chiama <b>matrice completa</b> (o
          aumentata).
        </p>
      </div>

      <div className="card">
        <h2>Teorema di Rouché-Capelli</h2>
        <p>Il sistema <Formula tex="A\vec x = \vec b" /> ammette soluzioni se e solo se:</p>
        <Formula block tex="\text{rg}(A) = \text{rg}([A \mid \vec b])" />
        <ul>
          <li>Se il rango è uguale al numero n di incognite: <b>soluzione unica</b>.</li>
          <li>Se il rango è minore di n: <b>infinite soluzioni</b>, con <Formula tex="n - \text{rg}(A)" /> parametri liberi (<Formula tex="\infty^{\,n-\text{rg}(A)}" />).</li>
          <li>Se <Formula tex="\text{rg}(A) \neq \text{rg}([A|\vec b])" />: <b>nessuna soluzione</b> (sistema impossibile).</li>
        </ul>
      </div>

      <div className="card">
        <h2>Metodo di eliminazione di Gauss</h2>
        <p>
          Si applicano alla matrice completa le <b>operazioni elementari</b> (scambiare due righe,
          moltiplicare una riga per uno scalare non nullo, sommare a una riga un multiplo di
          un'altra) fino a ottenere una forma a scala (o ridotta per righe). Da lì si legge
          direttamente il rango e, per sostituzione all'indietro, la soluzione.
        </p>
      </div>

      <div className="card">
        <h2>Regola di Cramer</h2>
        <p>
          Se il sistema è quadrato (m = n) e <Formula tex="\det A \neq 0" />, la soluzione unica è:
        </p>
        <Formula block tex="x_i = \frac{\det A_i}{\det A}" />
        <p>
          dove <Formula tex="A_i" /> è la matrice A con la colonna i sostituita dal vettore dei
          termini noti <Formula tex="\vec b" />.
        </p>
      </div>

      <div className="card">
        <h2>Esempio svolto</h2>
        <Formula block tex="\begin{cases} x + y = 3 \\ 2x - y = 0 \end{cases}" />
        <p>
          Matrice <Formula tex="A = \begin{pmatrix}1&1\\2&-1\end{pmatrix}" />,{" "}
          <Formula tex="\det A = -1-2=-3 \neq 0" />: soluzione unica per Cramer.
        </p>
        <Formula block tex="x = \frac{\begin{vmatrix}3&1\\0&-1\end{vmatrix}}{-3} = \frac{-3}{-3}=1, \qquad y = \frac{\begin{vmatrix}1&3\\2&0\end{vmatrix}}{-3} = \frac{-6}{-3}=2" />
        <p>
          Soluzione: <Formula tex="(x,y) = (1,2)" />. Verifica anche i sistemi con infinite
          soluzioni o impossibili nella sezione <b>Calcolatore</b>, che applica automaticamente
          Rouché-Capelli.
        </p>
      </div>
    </>
  );
}

export function SistemiLineari() {
  return (
    <SectionShell
      pill="Teoria · 4"
      title="Sistemi lineari"
      teoria={<Teoria />}
      simulazione={<SystemSim />}
      esercizi={esercizi}
      quizTopic="Sistemi lineari"
    />
  );
}
