import { Formula } from "../../components/Formula";
import { LineProjectionPlot } from "../../components/LineProjectionPlot";
import { PlaneProjectionPlot } from "../../components/PlaneProjectionPlot";

export function ProiezioniDistanze() {
  return (
    <div>
      <span className="pill">Teoria · 8</span>
      <h1>Proiezioni e distanze</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Come proiettare un punto su una retta (in <Formula tex="\mathbb{R}^2" />) o su un piano (in{" "}
        <Formula tex="\mathbb{R}^3" />) e calcolarne la distanza, con due metodi equivalenti: quello
        basato sull'<b>equazione</b> della retta/piano e quello <b>vettoriale</b>.
      </p>

      {/* ---------------- Parte 1 ---------------- */}
      <h2 style={{ marginTop: "1.5rem" }}>Parte 1 — Punto e retta in ℝ²</h2>

      <div className="card">
        <h3>Metodo con l'equazione della retta</h3>
        <p>
          Retta <Formula tex="r:\ ax + by + c = 0" /> e punto <Formula tex="P = (x_0, y_0)" />. Il
          vettore <Formula tex="(a, b)" /> è <b>normale</b> alla retta. La distanza è:
        </p>
        <Formula block tex="d(P, r) = \frac{|a x_0 + b y_0 + c|}{\sqrt{a^2 + b^2}}" />
        <p>Il <b>piede della perpendicolare</b> H (proiezione di P su r) si ottiene spostandosi da P lungo la normale:</p>
        <Formula block tex="H = P - \frac{a x_0 + b y_0 + c}{a^2 + b^2}\,(a, b)" />
      </div>

      <div className="card">
        <h3>Metodo vettoriale</h3>
        <p>
          Retta per un punto A con vettore direttore <Formula tex="\vec v" />, e punto P. Si
          decompone <Formula tex="\vec{AP}" /> lungo <Formula tex="\vec v" /> e nella direzione
          perpendicolare. La <b>proiezione</b> (piede H) è la componente lungo <Formula tex="\vec v" />:
        </p>
        <Formula block tex="H = A + \frac{\vec{AP}\cdot\vec v}{\vec v\cdot\vec v}\,\vec v" />
        <p>La <b>distanza</b> è la norma della componente perpendicolare; in ℝ² si calcola comodamente col prodotto vettoriale (scalare):</p>
        <Formula block tex="d(P, r) = \frac{|\vec{AP}\times\vec v|}{|\vec v|}, \qquad \vec{AP}\times\vec v = AP_x\,v_y - AP_y\,v_x" />
      </div>

      <div className="card">
        <h3>Esempio svolto</h3>
        <p>Retta <Formula tex="r:\ 3x + 4y - 5 = 0" />, punto <Formula tex="P = (2, 3)" />.</p>
        <p><b>Con l'equazione:</b></p>
        <Formula block tex="d = \frac{|3\cdot2 + 4\cdot3 - 5|}{\sqrt{9+16}} = \frac{13}{5} = 2{,}6" />
        <Formula block tex="H = (2,3) - \frac{13}{25}(3,4) = \left(\tfrac{11}{25}, \tfrac{23}{25}\right)" />
        <p>
          <b>Vettoriale:</b> prendiamo <Formula tex="A = (3,-1)" /> sulla retta e{" "}
          <Formula tex="\vec v = (4,-3)" /> (direttore). Allora <Formula tex="\vec{AP} = (-1, 4)" />:
        </p>
        <Formula block tex="\vec{AP}\times\vec v = (-1)(-3) - (4)(4) = -13 \ \Rightarrow\ d = \frac{|-13|}{5} = \frac{13}{5}" />
        <Formula block tex="H = (3,-1) + \frac{\vec{AP}\cdot\vec v}{25}\,\vec v = (3,-1) + \frac{-16}{25}(4,-3) = \left(\tfrac{11}{25}, \tfrac{23}{25}\right)" />
        <p>I due metodi danno lo stesso piede H e la stessa distanza. Graficamente:</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LineProjectionPlot a={3} b={4} c={-5} point={[2, 3]} />
        </div>
      </div>

      {/* ---------------- Parte 2 ---------------- */}
      <h2 style={{ marginTop: "2rem" }}>Parte 2 — Punto e piano in ℝ³</h2>

      <div className="card">
        <h3>Metodo con l'equazione del piano</h3>
        <p>
          Piano <Formula tex="\pi:\ ax + by + cz + d = 0" /> e punto{" "}
          <Formula tex="P = (x_0, y_0, z_0)" />. Il vettore <Formula tex="\vec n = (a,b,c)" /> è{" "}
          <b>normale</b> al piano. La distanza è:
        </p>
        <Formula block tex="d(P, \pi) = \frac{|a x_0 + b y_0 + c z_0 + d|}{\sqrt{a^2 + b^2 + c^2}}" />
        <p>Il piede della perpendicolare (proiezione H) si ottiene spostandosi da P lungo la normale:</p>
        <Formula block tex="H = P - \frac{a x_0 + b y_0 + c z_0 + d}{a^2 + b^2 + c^2}\,(a, b, c)" />
      </div>

      <div className="card">
        <h3>Metodo vettoriale</h3>
        <p>
          Piano per un punto A con normale <Formula tex="\vec n" />, e punto P. La distanza è il
          modulo della proiezione di <Formula tex="\vec{AP}" /> sulla normale:
        </p>
        <Formula block tex="d(P, \pi) = \frac{|\vec{AP}\cdot\vec n|}{|\vec n|}" />
        <p>e la proiezione H si ottiene sottraendo da P la componente lungo <Formula tex="\vec n" />:</p>
        <Formula block tex="H = P - \frac{\vec{AP}\cdot\vec n}{\vec n\cdot\vec n}\,\vec n" />
      </div>

      <div className="card">
        <h3>Esempio svolto</h3>
        <p>Piano <Formula tex="\pi:\ 2x - y + 2z - 6 = 0" />, punto <Formula tex="P = (4, 1, 3)" />. Qui <Formula tex="\vec n = (2,-1,2)" />, <Formula tex="|\vec n| = 3" />.</p>
        <Formula block tex="d = \frac{|2\cdot4 - 1 + 2\cdot3 - 6|}{\sqrt{4+1+4}} = \frac{|7|}{3} = \frac{7}{3}" />
        <Formula block tex="H = (4,1,3) - \frac{7}{9}(2,-1,2) = \left(\tfrac{22}{9}, \tfrac{16}{9}, \tfrac{13}{9}\right)" />
        <p>
          Col metodo vettoriale, preso A sul piano, si ha <Formula tex="\vec{AP}\cdot\vec n = 7" />, da
          cui <Formula tex="d = 7/3" /> e lo stesso H. Graficamente (piano viola, normale n in H,
          rosso = punto P e segmento della distanza):
        </p>
        <PlaneProjectionPlot a={2} b={-1} c={2} d={-6} point={[4, 1, 3]} />
      </div>

      <div className="card">
        <h3>In sintesi</h3>
        <ul>
          <li>La direzione della distanza è sempre la <b>normale</b> (retta: <Formula tex="(a,b)" />; piano: <Formula tex="(a,b,c)" />).</li>
          <li>Distanza = valore assoluto dell'equazione valutata in P, diviso la norma della normale.</li>
          <li>Proiezione H = P meno la componente di P lungo la normale.</li>
          <li>Il metodo vettoriale è equivalente: proietta <Formula tex="\vec{AP}" /> sulla direzione (per H) o sulla normale (per la distanza).</li>
        </ul>
      </div>
    </div>
  );
}
