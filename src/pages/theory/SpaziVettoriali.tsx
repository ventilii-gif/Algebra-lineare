import { Formula } from "../../components/Formula";

export function SpaziVettoriali() {
  return (
    <div>
      <span className="pill">Teoria · 2</span>
      <h1>Spazi vettoriali</h1>

      <div className="card">
        <h2>Definizione assiomatica</h2>
        <p>
          Uno spazio vettoriale su <Formula tex="\mathbb{R}" /> è un insieme V con due operazioni,
          somma e prodotto per uno scalare, che soddisfano:
        </p>
        <ul>
          <li>Chiusura: <Formula tex="\vec u + \vec v \in V" />, <Formula tex="k\vec v \in V" /></li>
          <li>Somma commutativa e associativa, con elemento neutro <Formula tex="\vec 0" /> e opposto <Formula tex="-\vec v" /></li>
          <li>Distributività: <Formula tex="k(\vec u + \vec v) = k\vec u + k\vec v" />, <Formula tex="(k+h)\vec v = k\vec v + h\vec v" /></li>
          <li>Associatività dello scalare: <Formula tex="k(h\vec v) = (kh)\vec v" />, e <Formula tex="1\cdot \vec v = \vec v" /></li>
        </ul>
        <p>
          Esempi: gli spazi geometrici <Formula tex="\mathcal V^1, \mathcal V^2, \mathcal V^3" />,
          le n-uple <Formula tex="\mathbb{R}^n" />, le matrici <Formula tex="m\times n" />, i
          polinomi di grado ≤ n.
        </p>
      </div>

      <div className="card">
        <h2>Combinazioni lineari e sottospazi</h2>
        <p>
          Un sottoinsieme <Formula tex="W \subseteq V" /> è un <b>sottospazio vettoriale</b> se è
          non vuoto ed è chiuso rispetto a somma e prodotto per scalare (contiene sempre <Formula tex="\vec 0" />).
          L'insieme di tutte le combinazioni lineari di un insieme di vettori
          <Formula tex="S = \{\vec v_1,\dots,\vec v_k\}" /> si chiama <b>span</b> (o inviluppo lineare):
        </p>
        <Formula block tex="\text{span}(S) = \{\lambda_1\vec v_1 + \dots + \lambda_k\vec v_k : \lambda_i \in \mathbb{R}\}" />
      </div>

      <div className="card">
        <h2>Indipendenza lineare</h2>
        <p>
          I vettori <Formula tex="\vec v_1,\dots,\vec v_k" /> sono <b>linearmente indipendenti</b>{" "}
          se l'unica combinazione lineare che dà il vettore nullo è quella con tutti i coefficienti
          nulli:
        </p>
        <Formula block tex="\lambda_1\vec v_1 + \dots + \lambda_k\vec v_k = \vec 0 \ \Rightarrow\ \lambda_1 = \dots = \lambda_k = 0" />
        <p>
          Equivalentemente, nessuno di essi è combinazione lineare degli altri. Verificare
          l'indipendenza di k vettori in <Formula tex="\mathbb{R}^n" /> equivale a controllare che
          la matrice che li ha come righe (o colonne) abbia rango k.
        </p>
      </div>

      <div className="card">
        <h2>Base e dimensione</h2>
        <p>
          Una <b>base</b> di V è un insieme di vettori linearmente indipendenti che generano V
          (ogni vettore di V si scrive in modo <i>unico</i> come loro combinazione lineare). Tutte
          le basi di uno stesso spazio hanno lo stesso numero di elementi: questo numero è la{" "}
          <b>dimensione</b> di V, <Formula tex="\dim V" />.
        </p>
        <p>
          Esempio: la base canonica di <Formula tex="\mathbb{R}^3" /> è{" "}
          <Formula tex="e_1=(1,0,0),\ e_2=(0,1,0),\ e_3=(0,0,1)" />, quindi{" "}
          <Formula tex="\dim \mathbb{R}^3 = 3" />.
        </p>
        <p>
          Le <b>coordinate</b> di un vettore <Formula tex="\vec v" /> rispetto a una base{" "}
          <Formula tex="\mathcal B = (\vec e_1,\dots,\vec e_n)" /> sono gli scalari{" "}
          <Formula tex="(x_1,\dots,x_n)" /> tali che <Formula tex="\vec v = x_1\vec e_1 + \dots + x_n\vec e_n" />.
        </p>
      </div>

      <div className="card">
        <h2>Esempio svolto: verificare l'indipendenza</h2>
        <p>
          I vettori <Formula tex="\vec v_1=(1,2,1)" />, <Formula tex="\vec v_2=(0,1,1)" />,{" "}
          <Formula tex="\vec v_3=(2,3,1)" /> sono indipendenti? Si calcola il determinante della
          matrice con questi vettori come righe:
        </p>
        <Formula block tex="\begin{vmatrix}1&2&1\\0&1&1\\2&3&1\end{vmatrix} = 1(1-3) -2(0-2)+1(0-2) = -2+4-2=0" />
        <p>
          Il determinante è nullo, quindi i tre vettori sono <b>linearmente dipendenti</b> (in
          particolare <Formula tex="\vec v_3 = 2\vec v_1 - \vec v_2" />, verificabile per
          sostituzione). Puoi controllare rango e dipendenza di qualsiasi insieme di vettori nella
          sezione <b>Calcolatore</b>.
        </p>
      </div>
    </div>
  );
}
