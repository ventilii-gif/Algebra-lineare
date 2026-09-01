import { Formula } from "../../components/Formula";
import { SectionShell } from "../../components/section/SectionShell";
import { ReflectionSim } from "../../components/sim/ReflectionSim";
import type { Exercise } from "../../components/section/ExerciseSet";

const esercizi: Exercise[] = [
  { level: "Facile", prompt: (<span>Rifletti <Formula tex="(3, 1)" /> rispetto all'asse x. Scrivi (x, y).</span>), expected: [3, -1], solutionText: "(3, -1)", placeholder: "es. 3,-1", hints: ["La riflessione sull'asse x cambia segno alla y.", "(x, −y)."] },
  { level: "Facile", prompt: (<span>Rifletti <Formula tex="(2, 5)" /> rispetto all'asse y. Scrivi (x, y).</span>), expected: [-2, 5], solutionText: "(-2, 5)", placeholder: "es. -2,5", hints: ["La riflessione sull'asse y cambia segno alla x.", "(−x, y)."] },
  { level: "Medio", prompt: (<span>Rifletti <Formula tex="(3, 1)" /> rispetto alla bisettrice <Formula tex="y = x" />. Scrivi (x, y).</span>), expected: [1, 3], solutionText: "(1, 3)", placeholder: "es. 1,3", hints: ["La riflessione rispetto a y = x scambia le coordinate.", "(x, y) → (y, x)."] },
  { level: "Medio", prompt: (<span>La matrice di riflessione rispetto a <Formula tex="y=x" /> è <Formula tex="\begin{pmatrix}0&1\\1&0\end{pmatrix}" />. Applicala a <Formula tex="(2, 0)" />. Scrivi (x, y).</span>), expected: [0, 2], solutionText: "(0, 2)", placeholder: "es. 0,2", hints: ["Moltiplica la matrice per il vettore colonna."] },
  { level: "Difficile", prompt: (<span>Rifletti <Formula tex="P=(4, 1)" /> rispetto alla retta <Formula tex="x + y - 3 = 0" />. Usa <Formula tex="P' = P - 2\frac{ax_0+by_0+c}{a^2+b^2}(a,b)" />. Scrivi (x, y).</span>), expected: [2, -1], solutionText: "(2, -1)", placeholder: "es. 2,-1", hints: ["Numeratore = 4+1−3 = 2, denominatore = 2.", "P − 2·1·(1,1) = (4,1) − (2,2)."] },
  { level: "Difficile", prompt: (<span>Quanto vale il determinante di una qualunque matrice di riflessione?</span>), expected: [-1], solutionText: "-1", placeholder: "es. -1", hints: ["Una riflessione inverte l'orientamento.", "det = −1."] },
];

function Teoria() {
  return (
    <>
      <div className="card">
        <h2>Che cos'è una riflessione</h2>
        <p>
          Una <b>riflessione</b> (o simmetria assiale) manda ogni punto P nel punto P'
          "specchiato" rispetto a una retta: P' sta dalla parte opposta della retta, alla{" "}
          <b>stessa distanza</b>, e il segmento P–P' è <b>perpendicolare</b> alla retta, con il
          punto medio (il piede H) che appartiene alla retta. È una <b>isometria</b> (conserva le
          distanze) che <b>inverte l'orientamento</b>.
        </p>
      </div>

      <div className="card">
        <h2>Riflessione rispetto a una direzione (retta per l'origine)</h2>
        <p>
          Sia la retta-specchio passante per l'origine con <b>versore direttore</b>{" "}
          <Formula tex="\hat d" /> (di modulo 1). La riflessione di un vettore{" "}
          <Formula tex="\vec v" /> si ottiene raddoppiando la sua proiezione sulla direzione e
          sottraendo il vettore stesso:
        </p>
        <Formula block tex="\vec v\,' = 2(\vec v \cdot \hat d)\,\hat d - \vec v" />
        <p>
          In forma matriciale, se la retta forma un angolo <Formula tex="\theta" /> con l'asse x:
        </p>
        <Formula block tex="R_\theta = \begin{pmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta \end{pmatrix}" />
        <p>In coordinate, le formule esplicite di <Formula tex="x'" /> e <Formula tex="y'" /> in funzione di <Formula tex="x" /> e <Formula tex="y" /> sono:</p>
        <Formula block tex="\begin{cases} x' = x\,\cos 2\theta + y\,\sin 2\theta \\[4pt] y' = x\,\sin 2\theta - y\,\cos 2\theta \end{cases}" />
        <p>Casi notevoli:</p>
        <ul>
          <li>Asse x (θ = 0): <Formula tex="\begin{pmatrix}1&0\\0&-1\end{pmatrix}" />, cioè <Formula tex="(x,y)\mapsto(x,-y)" />.</li>
          <li>Asse y (θ = 90°): <Formula tex="\begin{pmatrix}-1&0\\0&1\end{pmatrix}" />, cioè <Formula tex="(x,y)\mapsto(-x,y)" />.</li>
          <li>Bisettrice y = x (θ = 45°): <Formula tex="\begin{pmatrix}0&1\\1&0\end{pmatrix}" />, cioè <Formula tex="(x,y)\mapsto(y,x)" />.</li>
        </ul>
        <p>
          <b>Proprietà:</b> <Formula tex="R^2 = I" /> (applicandola due volte si torna al punto di
          partenza), <Formula tex="\det R = -1" />, e gli autovalori sono <Formula tex="+1" /> (per
          i vettori lungo la retta, che restano fermi) e <Formula tex="-1" /> (per quelli
          perpendicolari, che si ribaltano).
        </p>
      </div>

      <div className="card">
        <h2>Riflessione rispetto a una direzione — esempio</h2>
        <p>Riflettiamo <Formula tex="\vec v = (3, 1)" /> rispetto alla bisettrice <Formula tex="y=x" /> (<Formula tex="\hat d = (\tfrac{1}{\sqrt2}, \tfrac{1}{\sqrt2})" />):</p>
        <Formula block tex="\vec v \cdot \hat d = \frac{3+1}{\sqrt2} = \frac{4}{\sqrt2} = 2\sqrt2" />
        <Formula block tex="\vec v\,' = 2(2\sqrt2)\left(\tfrac{1}{\sqrt2}, \tfrac{1}{\sqrt2}\right) - (3,1) = (4,4) - (3,1) = (1, 3)" />
        <p>Come atteso, la riflessione rispetto a y = x scambia le coordinate.</p>
      </div>

      <div className="card">
        <h2>Riflessione rispetto a una retta (caso generale)</h2>
        <p>
          Se la retta <b>non passa per l'origine</b>, la riflessione è una <b>isometria affine</b>.
          Il modo più semplice: si trova il <b>piede H</b> (proiezione di P sulla retta) e si usa
          che H è il punto medio tra P e P':
        </p>
        <Formula block tex="P' = 2H - P" />
        <p>
          Usando l'equazione della retta <Formula tex="ax + by + c = 0" /> (la stessa quantità
          delle distanze/proiezioni):
        </p>
        <Formula block tex="P' = P - 2\,\frac{a x_0 + b y_0 + c}{a^2 + b^2}\,(a, b)" />
        <p>
          In coordinate, le formule esplicite di <Formula tex="x'" /> e <Formula tex="y'" /> in
          funzione di <Formula tex="x" /> e <Formula tex="y" /> sono:
        </p>
        <Formula block tex="\begin{cases} x' = x - \dfrac{2a\,(ax + by + c)}{a^2 + b^2} \\[6pt] y' = y - \dfrac{2b\,(ax + by + c)}{a^2 + b^2} \end{cases}" />
        <p>ovvero, sviluppando i conti:</p>
        <Formula block tex="\begin{cases} x' = \dfrac{(b^2 - a^2)\,x - 2ab\,y - 2ac}{a^2 + b^2} \\[6pt] y' = \dfrac{-2ab\,x + (a^2 - b^2)\,y - 2bc}{a^2 + b^2} \end{cases}" />
        <p>
          Rispetto alla proiezione, il fattore è <b>2</b> invece di 1: la proiezione si ferma sulla
          retta (H), la riflessione prosegue fino a P' dall'altra parte.
        </p>
      </div>

      <div className="card">
        <h2>Riflessione rispetto a una retta — esempio</h2>
        <p>Riflettiamo <Formula tex="P = (4, 1)" /> rispetto alla retta <Formula tex="x + y - 3 = 0" /> (a=1, b=1, c=−3):</p>
        <Formula block tex="\frac{a x_0 + b y_0 + c}{a^2+b^2} = \frac{4 + 1 - 3}{1+1} = \frac{2}{2} = 1" />
        <Formula block tex="P' = (4,1) - 2\cdot 1 \cdot (1,1) = (4,1) - (2,2) = (2, -1)" />
        <p>
          Verifica: il piede è <Formula tex="H = (4,1) - 1\cdot(1,1) = (3,0)" />, che sta sulla
          retta (3+0=3), e <Formula tex="2H - P = (6,0) - (4,1) = (2,-1)" />. ✓
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Prova la costruzione nella scheda <b>Simulazione</b> e verifica i tuoi conti negli{" "}
          <b>Esercizi</b>.
        </p>
      </div>
    </>
  );
}

export function Riflessioni() {
  return (
    <SectionShell
      pill="Teoria · 10"
      title="Riflessioni"
      teoria={<Teoria />}
      simulazione={<ReflectionSim />}
      esercizi={esercizi}
      quizTopic="Riflessioni"
    />
  );
}
