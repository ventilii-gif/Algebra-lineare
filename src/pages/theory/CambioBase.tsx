import { Formula } from "../../components/Formula";
import { FramePlane2D } from "../../components/FramePlane2D";
import { FramePlane3D } from "../../components/FramePlane3D";
import { Link } from "react-router-dom";

export function CambioBase() {
  return (
    <div>
      <span className="pill">Teoria · 7</span>
      <h1>Cambiamenti di base e di riferimento</h1>

      <div className="card">
        <h2>Il problema</h2>
        <p>
          Un <b>sistema di riferimento</b> è dato da un'origine e da una base. In due dimensioni:
          RIF = (O; <Formula tex="\vec i, \vec j" />). Un punto P è individuato dalle sue{" "}
          <b>coordinate</b> <Formula tex="(x, y)" />, che significano:
        </p>
        <Formula block tex="P = O + x\,\vec i + y\,\vec j" />
        <p>
          Dato un <b>nuovo riferimento</b> RIF' = (O'; <Formula tex="\vec i\,', \vec j\,'" />), vogliamo
          le coordinate <Formula tex="(x', y')" /> dello stesso punto P nel nuovo riferimento, cioè:
        </p>
        <Formula block tex="P = O' + x'\,\vec i\,' + y'\,\vec j\,'" />
      </div>

      <div className="card">
        <h2>1 dimensione</h2>
        <p>
          RIF = (O; <Formula tex="\vec i" />), un punto P ha coordinata x: <Formula tex="P = O + x\,\vec i" />.
          Nel nuovo riferimento RIF' = (O'; <Formula tex="\vec i\,'" />) con <Formula tex="\vec i\,' = \alpha\,\vec i" />{" "}
          e O' di coordinata <Formula tex="x_{O'}" /> (nel vecchio riferimento):
        </p>
        <Formula block tex="x = x_{O'} + \alpha\,x' \quad\Longrightarrow\quad x' = \frac{x - x_{O'}}{\alpha}" />
        <p><b>Esempio.</b> O' in <Formula tex="x_{O'}=2" />, <Formula tex="\vec i\,'=2\vec i" /> (<Formula tex="\alpha=2" />), P in <Formula tex="x=7" />:</p>
        <Formula block tex="x' = \frac{7 - 2}{2} = \frac{5}{2}" />
      </div>

      <div className="card">
        <h2>2 dimensioni — algebricamente</h2>
        <p>
          Esprimiamo i nuovi versori nel vecchio riferimento: <Formula tex="\vec i\,' = a\,\vec i + c\,\vec j" />,{" "}
          <Formula tex="\vec j\,' = b\,\vec i + d\,\vec j" />. La <b>matrice del cambiamento di base</b> B
          ha per colonne i nuovi vettori di base (scritti nel vecchio riferimento):
        </p>
        <Formula block tex="B = \begin{pmatrix} a & b \\ c & d \end{pmatrix}, \qquad O' = \begin{pmatrix} x_{O'} \\ y_{O'} \end{pmatrix}" />
        <p>
          Il legame tra le coordinate vecchie <Formula tex="P = (x,y)" /> e nuove{" "}
          <Formula tex="P' = (x',y')" /> è:
        </p>
        <Formula block tex="P = B\,P' + O' \qquad\Longleftrightarrow\qquad P' = B^{-1}\,(P - O')" />
        <p>
          Prima si <b>sottrae la nuova origine</b> (traslazione), poi si <b>cambia base</b>{" "}
          moltiplicando per l'inversa <Formula tex="B^{-1}" />. La matrice B è invertibile se e solo
          se i nuovi versori sono linearmente indipendenti (<Formula tex="\det B \neq 0" />).
        </p>
      </div>

      <div className="card">
        <h2>2 dimensioni — esempio svolto e grafico</h2>
        <p>
          RIF' con O' = (1, 0), <Formula tex="\vec i\,' = (1,1)" />, <Formula tex="\vec j\,' = (-1,1)" />;
          punto P = (3, 2) nel vecchio riferimento.
        </p>
        <Formula block tex="B = \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix}, \quad \det B = 2, \quad B^{-1} = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix}" />
        <Formula block tex="P - O' = \begin{pmatrix} 3-1 \\ 2-0 \end{pmatrix} = \begin{pmatrix} 2 \\ 2 \end{pmatrix}" />
        <Formula block tex="P' = B^{-1}(P - O') = \frac{1}{2}\begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix}\begin{pmatrix} 2 \\ 2 \end{pmatrix} = \begin{pmatrix} 2 \\ 0 \end{pmatrix}" />
        <p>
          Quindi P ha coordinate <Formula tex="(x', y') = (2, 0)" /> in RIF'. Verifica:{" "}
          <Formula tex="O' + 2\,\vec i\,' + 0\,\vec j\,' = (1,0) + 2(1,1) = (3,2) = P" />. Graficamente
          (grigio = vecchio riferimento, viola = nuovo riferimento, rosso = punto P e la sua
          decomposizione lungo <Formula tex="\vec i\,'" /> e <Formula tex="\vec j\,'" />):
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <FramePlane2D oPrime={[1, 0]} iPrime={[1, 1]} jPrime={[-1, 1]} point={[3, 2]} pNew={[2, 0]} range={5} size={380} />
        </div>
      </div>

      <div className="card">
        <h2>3 dimensioni</h2>
        <p>
          Tutto si estende con una matrice <Formula tex="3\times 3" /> le cui colonne sono i nuovi
          versori <Formula tex="\vec i\,', \vec j\,', \vec k\,'" /> espressi nel vecchio riferimento:
        </p>
        <Formula block tex="B = \big(\ \vec i\,' \ \big|\ \vec j\,' \ \big|\ \vec k\,'\ \big), \qquad P' = B^{-1}(P - O')" />
        <p>
          <b>Esempio con base obliqua</b> (versori combinazione di i, j e k):{" "}
          <Formula tex="\vec i\,'=(1,1,0)" />, <Formula tex="\vec j\,'=(0,1,1)" />,{" "}
          <Formula tex="\vec k\,'=(1,0,1)" />; O' = (1,1,1), P = (3,4,4).
        </p>
        <Formula block tex="B = \begin{pmatrix} 1&0&1\\1&1&0\\0&1&1 \end{pmatrix}, \quad P - O' = \begin{pmatrix} 2\\3\\3 \end{pmatrix}, \quad P' = B^{-1}(P-O') = \begin{pmatrix} 1\\2\\1 \end{pmatrix}" />
        <p>
          Verifica: <Formula tex="O' + 1\,\vec i\,' + 2\,\vec j\,' + 1\,\vec k\,' = (1,1,1)+(1,1,0)+(0,2,2)+(1,0,1) = (3,4,4)" />.
        </p>
        <p style={{ color: "var(--text-muted)" }}>
          Vista assonometrica (grigio = vecchio riferimento con assi X, Y, Z; viola = nuovo
          riferimento; rosso = punto P e il parallelepipedo della sua decomposizione
          <Formula tex="P = O' + x'\vec i\,' + y'\vec j\,' + z'\vec k\,'" />). Usa la barra per ruotare:
        </p>
        <FramePlane3D
          oPrime={[1, 1, 1]}
          iPrime={[1, 1, 0]}
          jPrime={[0, 1, 1]}
          kPrime={[1, 0, 1]}
          point={[3, 4, 4]}
          pNew={[1, 2, 1]}
        />
      </div>

      <div className="card">
        <h2>In sintesi</h2>
        <ul>
          <li>Colonne di B = nuovi versori scritti nel vecchio riferimento.</li>
          <li>Traslazione dell'origine: <Formula tex="P - O'" />.</li>
          <li>Cambio di base: moltiplica per <Formula tex="B^{-1}" />.</li>
          <li>Formula unica: <Formula tex="P' = B^{-1}(P - O')" /> (in 1, 2 o 3 dimensioni).</li>
        </ul>
        <p>
          Prova qualsiasi cambiamento di riferimento, con passaggi e grafico, nel{" "}
          <Link to="/calcolatore">Calcolatore</Link> (scheda "Cambio di base").
        </p>
      </div>
    </div>
  );
}
