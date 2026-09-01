import { Formula } from "../../components/Formula";
import { SectionShell } from "../../components/section/SectionShell";
import { type Exercise } from "../../components/section/ExerciseSet";
import { VettoriSimulazione } from "./vettori/VettoriSimulazione";

const esercizi: Exercise[] = [
  {
    level: "Facile",
    prompt: (<span>Dati <Formula tex="\vec u = (2, 1)" /> e <Formula tex="\vec v = (3, 4)" />, calcola <Formula tex="\vec u + \vec v" />.</span>),
    expected: [5, 5],
    solutionText: "(5, 5)",
    placeholder: "es. 5,5",
    hints: ["Si sommano le componenti corrispondenti.", "(2+3, 1+4)."],
  },
  {
    level: "Facile",
    prompt: (<span>Calcola <Formula tex="3\cdot(2, -1)" /> (prodotto per uno scalare).</span>),
    expected: [6, -3],
    solutionText: "(6, -3)",
    placeholder: "es. 6,-3",
    hints: ["Si moltiplica ogni componente per 3.", "(3·2, 3·(-1))."],
  },
  {
    level: "Medio",
    prompt: (<span>Calcola il prodotto scalare <Formula tex="(1, 2, 3)\cdot(0, 1, -1)" />.</span>),
    expected: [-1],
    solutionText: "-1",
    placeholder: "es. -1",
    hints: ["Somma dei prodotti componente per componente.", "1·0 + 2·1 + 3·(-1)."],
  },
  {
    level: "Medio",
    prompt: (<span>Calcola il modulo <Formula tex="|(3, 4)|" />.</span>),
    expected: [5],
    solutionText: "5",
    placeholder: "es. 5",
    hints: ["Il modulo è la radice della somma dei quadrati.", "√(3² + 4²) = √25."],
  },
  {
    level: "Difficile",
    prompt: (<span>Calcola il prodotto vettoriale <Formula tex="(1, 0, 0)\times(0, 1, 0)" />.</span>),
    expected: [0, 0, 1],
    solutionText: "(0, 0, 1)",
    placeholder: "es. 0,0,1",
    hints: ["Usa la formula del prodotto vettoriale.", "È il versore perpendicolare a entrambi: k = (0,0,1)."],
  },
  {
    level: "Difficile",
    prompt: (<span>Trova il versore (modulo 1) associato a <Formula tex="(0, 3)" />.</span>),
    expected: [0, 1],
    solutionText: "(0, 1)",
    placeholder: "es. 0,1",
    hints: ["Dividi il vettore per il suo modulo.", "|(0,3)| = 3, quindi (0,3)/3."],
  },
];

export function Vettori() {
  return (
    <SectionShell
      pill="Teoria · 1"
      title="Vettori"
      teoria={<Teoria />}
      simulazione={<VettoriSimulazione />}
      esercizi={esercizi}
      quizTopic="Vettori"
    />
  );
}

function Teoria() {
  return (
    <div>
      <div className="card">
        <h2>Spazi affini e punti</h2>
        <p>
          Uno spazio affine <Formula tex="\mathbb{A}^n" /> è un insieme di <b>punti</b> in cui non
          esiste un'origine privilegiata: ha senso parlare della posizione relativa di due punti,
          ma non di "sommare" due punti. Fissato un riferimento (un punto origine O e una base),
          ogni punto P è individuato da una n-upla di coordinate.
        </p>
      </div>

      <div className="card">
        <h2>Direzioni, giaciture e vettori</h2>
        <p>
          Una <b>direzione</b> è una classe di equivalenza di segmenti orientati con la stessa
          lunghezza, direzione e verso (segmenti "equipollenti"): il vettore <Formula tex="\vec{v} = \overrightarrow{AB}" />{" "}
          rappresenta lo spostamento dal punto A al punto B, indipendentemente da dove si trovi
          l'origine del segmento. Una <b>giacitura</b> è l'insieme di tutte le direzioni parallele
          a un dato sottospazio (una retta o un piano): è ciò che resta di una retta/piano se se ne
          dimentica la posizione, mantenendo solo l'orientamento.
        </p>
        <p>
          Passando dai punti dello spazio affine <Formula tex="\mathbb{A}^n" /> alle direzioni si
          ottiene lo spazio vettoriale geometrico <Formula tex="\mathcal{V}^n" /> (n = 1, 2, 3):
          l'insieme dei vettori applicati liberamente, cioè trasportabili parallelamente a se
          stessi in un punto qualsiasi.
        </p>
      </div>

      <div className="card">
        <h2>Operazioni sui vettori</h2>
        <p><b>Somma (regola del parallelogramma / punta-coda):</b></p>
        <Formula block tex="\vec{u} + \vec{v} = (u_1 + v_1,\ u_2 + v_2,\ u_3 + v_3)" />
        <p>Si applica <Formula tex="\vec{v}" /> a partire dalla punta di <Formula tex="\vec{u}" />: il vettore somma va dalla coda di <Formula tex="\vec u" /> alla punta di <Formula tex="\vec v" />.</p>

        <p><b>Prodotto per uno scalare:</b></p>
        <Formula block tex="k\vec{v} = (kv_1,\ kv_2,\ kv_3)" />
        <p>
          Se <Formula tex="k > 0" /> il vettore mantiene il verso, se <Formula tex="k < 0" /> si
          inverte; il modulo viene moltiplicato per <Formula tex="|k|" />.
        </p>

        <p><b>Prodotto scalare</b> (in uno spazio euclideo <Formula tex="\mathcal{E}^n" />):</p>
        <Formula block tex="\vec{u} \cdot \vec{v} = |\vec u||\vec v|\cos\theta = u_1v_1 + u_2v_2 + u_3v_3" />
        <p>Serve a calcolare angoli e proiezioni; se <Formula tex="\vec u \cdot \vec v = 0" /> i due vettori sono ortogonali.</p>

        <p><b>Prodotto vettoriale</b> (solo in <Formula tex="\mathcal{E}^3" />):</p>
        <Formula block tex="\vec u \times \vec v = (u_2v_3 - u_3v_2,\ u_3v_1 - u_1v_3,\ u_1v_2 - u_2v_1)" />
        <p>
          È perpendicolare sia a <Formula tex="\vec u" /> che a <Formula tex="\vec v" />, e il suo
          modulo è l'area del parallelogramma generato dai due vettori.
        </p>
      </div>

      <div className="card">
        <h2>Combinazione lineare e dipendenza</h2>
        <p>
          Un vettore <Formula tex="\vec w" /> è combinazione lineare di <Formula tex="\vec v_1, \dots, \vec v_k" /> se esistono scalari
          <Formula tex="\lambda_1,\dots,\lambda_k" /> tali che
        </p>
        <Formula block tex="\vec w = \lambda_1 \vec v_1 + \dots + \lambda_k \vec v_k" />
        <p>
          Due vettori sono <b>paralleli</b> (linearmente dipendenti) se uno è multiplo scalare
          dell'altro. Tre vettori in <Formula tex="\mathcal V^3" /> sono <b>complanari</b>
          (dipendenti) se il loro prodotto misto (determinante 3×3 delle componenti) è nullo.
        </p>
      </div>

      <div className="card">
        <h2>Esempio svolto</h2>
        <p>
          Dati <Formula tex="\vec u = (1, 2, -1)" /> e <Formula tex="\vec v = (0, 1, 3)" />:
        </p>
        <Formula block tex="\vec u + \vec v = (1, 3, 2), \qquad 2\vec u = (2, 4, -2)" />
        <Formula block tex="\vec u \cdot \vec v = 1\cdot 0 + 2\cdot 1 + (-1)\cdot 3 = -1" />
        <Formula block tex="\vec u \times \vec v = (2\cdot3 - (-1)\cdot1,\ (-1)\cdot0 - 1\cdot3,\ 1\cdot1 - 2\cdot0) = (7, -3, 1)" />
      </div>
    </div>
  );
}
