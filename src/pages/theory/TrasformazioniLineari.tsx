import { Formula } from "../../components/Formula";
import { VectorPlane } from "../../components/VectorPlane";
import { Link } from "react-router-dom";

export function TrasformazioniLineari() {
  const c = Math.SQRT1_2; // cos45 = sin45 ≈ 0.707

  return (
    <div>
      <span className="pill">Teoria · 9</span>
      <h1>Trasformazioni lineari</h1>

      <div className="card">
        <h2>Definizione</h2>
        <p>
          Una <b>trasformazione (o applicazione) lineare</b> <Formula tex="T: V \to W" /> tra due
          spazi vettoriali è una funzione che rispetta somma e prodotto per scalare:
        </p>
        <Formula block tex="T(\vec u + \vec v) = T(\vec u) + T(\vec v), \qquad T(k\,\vec v) = k\,T(\vec v)" />
        <p>
          Equivalentemente, conserva le combinazioni lineari:{" "}
          <Formula tex="T(\alpha\vec u + \beta\vec v) = \alpha\,T(\vec u) + \beta\,T(\vec v)" />. Ne
          segue sempre <Formula tex="T(\vec 0) = \vec 0" />.
        </p>
      </div>

      <div className="card">
        <h2>Matrice associata</h2>
        <p>
          Fissate le basi, una trasformazione lineare <Formula tex="T:\mathbb{R}^n \to \mathbb{R}^m" />{" "}
          è rappresentata da una matrice A: <Formula tex="T(\vec x) = A\,\vec x" />. Le{" "}
          <b>colonne di A</b> sono le immagini dei vettori della base canonica:
        </p>
        <Formula block tex="A = \big(\ T(\vec e_1) \ \big|\ T(\vec e_2) \ \big|\ \cdots\ \big|\ T(\vec e_n)\ \big)" />
        <p>
          Quindi per costruire la matrice basta capire dove finiscono <Formula tex="\vec e_1, \vec e_2, \dots" />
        </p>
      </div>

      <div className="card">
        <h2>Trasformazioni notevoli in ℝ²</h2>
        <p><b>Rotazione</b> di angolo <Formula tex="\theta" /> (antioraria):</p>
        <Formula block tex="R_\theta = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}" />
        <p><b>Riflessione</b> rispetto all'asse x, <b>scala</b>, <b>proiezione</b> sull'asse x, <b>shear</b> (taglio):</p>
        <Formula block tex="\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}, \quad \begin{pmatrix} k & 0 \\ 0 & k \end{pmatrix}, \quad \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}, \quad \begin{pmatrix} 1 & k \\ 0 & 1 \end{pmatrix}" />
        <p>
          Esempio: una rotazione di 45° manda <Formula tex="\vec e_1=(1,0)" /> in{" "}
          <Formula tex="(\tfrac{\sqrt2}{2}, \tfrac{\sqrt2}{2})" /> e <Formula tex="\vec e_2=(0,1)" /> in{" "}
          <Formula tex="(-\tfrac{\sqrt2}{2}, \tfrac{\sqrt2}{2})" /> (le colonne della matrice):
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <VectorPlane
            range={2}
            size={320}
            vectors={[
              { x: 1, y: 0, color: "#8a8a9a", label: "e1", dashed: true },
              { x: 0, y: 1, color: "#8a8a9a", label: "e2", dashed: true },
              { x: c, y: c, color: "#5b5bd6", label: "T(e1)" },
              { x: -c, y: c, color: "#d64545", label: "T(e2)" },
            ]}
          />
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Puoi sperimentare qualunque matrice 2×2 (e vedere come deforma tutto il piano) nella
          sezione <Link to="/visualizzazioni">Visualizzazioni</Link>.
        </p>
      </div>

      <div className="card">
        <h2>Nucleo e immagine</h2>
        <p>
          Il <b>nucleo</b> (kernel) è l'insieme dei vettori che vengono mandati nel vettore nullo;
          l'<b>immagine</b> è l'insieme dei vettori raggiunti:
        </p>
        <Formula block tex="\ker(T) = \{\vec v : T(\vec v) = \vec 0\}, \qquad \operatorname{Im}(T) = \{T(\vec v) : \vec v \in V\}" />
        <p>
          Sono entrambi sottospazi. La dimensione dell'immagine è il <b>rango</b> di A; la
          dimensione del nucleo è la <b>nullità</b>. Vale il <b>teorema del rango (nullità + rango)</b>:
        </p>
        <Formula block tex="\dim\ker(T) + \dim\operatorname{Im}(T) = \dim V = n" />
        <p>
          T è <b>iniettiva</b> se e solo se <Formula tex="\ker(T) = \{\vec 0\}" />; è{" "}
          <b>suriettiva</b> se <Formula tex="\dim\operatorname{Im}(T) = m" />. Per una matrice
          quadrata, T è invertibile <Formula tex="\iff \det A \neq 0 \iff \ker(T)=\{\vec 0\}" />.
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Il rango si può calcolare con l'<Link to="/calcolatore">Eliminazione di Gauss</Link> nel
          calcolatore.
        </p>
      </div>

      <div className="card">
        <h2>Composizione</h2>
        <p>
          La composizione di due trasformazioni lineari è ancora lineare, e la sua matrice è il{" "}
          <b>prodotto</b> delle matrici (applicata prima quella a destra):
        </p>
        <Formula block tex="(T \circ S)(\vec x) = T(S(\vec x)) = A\,(B\,\vec x) = (AB)\,\vec x" />
        <p>
          Per questo il prodotto di matrici non è commutativo: comporre una rotazione e poi una
          riflessione dà un risultato diverso dall'ordine inverso.
        </p>
      </div>

      <div className="card">
        <h2>Direzioni invarianti: autovalori e autovettori</h2>
        <p>
          Gli <b>autovettori</b> di A sono le direzioni che la trasformazione lascia invariate (le
          riscala soltanto, del fattore dato dall'<b>autovalore</b>): <Formula tex="T(\vec v) = \lambda\vec v" />.
          Sono lo strumento per capire la "geometria" di una trasformazione (assi di una rotazione,
          direzioni di uno shear, ecc.).
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Approfondimento nella sezione <Link to="/teoria/autovalori">Autovalori e autovettori</Link>.
        </p>
      </div>
    </div>
  );
}
