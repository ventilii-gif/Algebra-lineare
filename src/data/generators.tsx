import { Formula } from "../components/Formula";
import type { Generator } from "../components/section/ExerciseSet";

const rint = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const nz = (a: number, b: number) => {
  let v = 0;
  while (v === 0) v = rint(a, b);
  return v;
};
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const det3 = (m: number[][]) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

export const generatorsByTopic: Record<string, Generator[]> = {
  Vettori: [
    {
      level: "Facile",
      title: "Somma di vettori",
      make: () => {
        const u = [rint(-5, 5), rint(-5, 5)];
        const v = [rint(-5, 5), rint(-5, 5)];
        return {
          prompt: (<span>Calcola <Formula tex={`(${u[0]}, ${u[1]}) + (${v[0]}, ${v[1]})`} />. Scrivi (x, y).</span>),
          expected: [u[0] + v[0], u[1] + v[1]],
          solutionText: `(${u[0] + v[0]}, ${u[1] + v[1]})`,
          placeholder: "es. 3,4",
          hints: ["Somma componente per componente."],
          steps: [`x: ${u[0]} + ${v[0]} = ${u[0] + v[0]}`, `y: ${u[1]} + ${v[1]} = ${u[1] + v[1]}`],
        };
      },
    },
    {
      level: "Medio",
      title: "Prodotto scalare",
      make: () => {
        const u = [rint(-4, 4), rint(-4, 4), rint(-4, 4)];
        const v = [rint(-4, 4), rint(-4, 4), rint(-4, 4)];
        const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
        return {
          prompt: (<span>Calcola il prodotto scalare <Formula tex={`(${u[0]}, ${u[1]}, ${u[2]}) \\cdot (${v[0]}, ${v[1]}, ${v[2]})`} />.</span>),
          expected: [dot],
          solutionText: `${dot}`,
          placeholder: "es. -1",
          hints: ["Somma dei prodotti componente per componente."],
          steps: [`${u[0]}·${v[0]} + ${u[1]}·${v[1]} + ${u[2]}·${v[2]}`, `= ${u[0] * v[0]} + ${u[1] * v[1]} + ${u[2] * v[2]} = ${dot}`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Prodotto vettoriale",
      make: () => {
        const u = [rint(-3, 3), rint(-3, 3), rint(-3, 3)];
        const v = [rint(-3, 3), rint(-3, 3), rint(-3, 3)];
        const c = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
        return {
          prompt: (<span>Calcola il prodotto vettoriale <Formula tex={`(${u[0]}, ${u[1]}, ${u[2]}) \\times (${v[0]}, ${v[1]}, ${v[2]})`} />. Scrivi le 3 componenti.</span>),
          expected: c,
          solutionText: `(${c[0]}, ${c[1]}, ${c[2]})`,
          placeholder: "es. 7,-3,1",
          hints: ["Usa la formula (u₂v₃−u₃v₂, u₃v₁−u₁v₃, u₁v₂−u₂v₁)."],
          steps: [`i: ${u[1]}·${v[2]} − ${u[2]}·${v[1]} = ${c[0]}`, `j: ${u[2]}·${v[0]} − ${u[0]}·${v[2]} = ${c[1]}`, `k: ${u[0]}·${v[1]} − ${u[1]}·${v[0]} = ${c[2]}`],
        };
      },
    },
    {
      level: "Medio",
      title: "Angolo tra vettori",
      make: () => {
        const kase = pick(["orto", "same", "opp"] as const);
        const a = nz(-4, 4), b = nz(-4, 4);
        let v: number[], ang: number, why: string;
        if (kase === "orto") { v = [-b, a]; ang = 90; why = "prodotto scalare nullo"; }
        else if (kase === "same") { const k = rint(1, 3); v = [k * a, k * b]; ang = 0; why = "stesso verso (multiplo positivo)"; }
        else { const k = rint(1, 3); v = [-k * a, -k * b]; ang = 180; why = "versi opposti (multiplo negativo)"; }
        const dot = a * v[0] + b * v[1];
        return {
          prompt: (<span>Qual è l'angolo (in gradi) tra <Formula tex={`(${a}, ${b})`} /> e <Formula tex={`(${v[0]}, ${v[1]})`} />?</span>),
          expected: [ang],
          solutionText: `${ang}°`,
          placeholder: "es. 90",
          hints: ["Guarda il prodotto scalare: 0 → 90°; multiplo positivo → 0°; multiplo negativo → 180°."],
          steps: [`prodotto scalare = ${a}·${v[0]} + ${b}·${v[1]} = ${dot}`, `→ ${ang}° (${why})`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Proiezione di un vettore su un altro",
      make: () => {
        const v = pick([[1, 1], [1, -1], [2, 1], [1, 2]]);
        const vv = v[0] * v[0] + v[1] * v[1];
        const t = nz(-3, 3);
        const d = nz(-2, 2);
        const u = [t * v[0] - d * v[1], t * v[1] + d * v[0]];
        const proj = [t * v[0], t * v[1]];
        const uv = t * vv;
        return {
          prompt: (<span>Proietta <Formula tex={`\\vec u = (${u[0]}, ${u[1]})`} /> sulla direzione di <Formula tex={`\\vec v = (${v[0]}, ${v[1]})`} />. Scrivi il vettore proiezione (x, y).</span>),
          expected: proj,
          solutionText: `(${proj[0]}, ${proj[1]})`,
          placeholder: "es. 2,2",
          hints: ["proiezione = ((u·v)/(v·v))·v.", `u·v = ${uv}, v·v = ${vv}`],
          steps: [`u·v = ${uv}, v·v = ${vv}`, `t = (u·v)/(v·v) = ${uv}/${vv} = ${t}`, `proiezione = ${t}·(${v[0]}, ${v[1]}) = (${proj[0]}, ${proj[1]})`],
        };
      },
    },
  ],

  "Spazi vettoriali": [
    {
      level: "Facile",
      title: "Dimensione di ℝⁿ",
      make: () => {
        const n = rint(2, 7);
        return {
          prompt: (<span>Qual è la dimensione di <Formula tex={`\\mathbb{R}^${n}`} />?</span>),
          expected: [n],
          solutionText: `${n}`,
          placeholder: "es. 4",
          hints: ["La base canonica ha un vettore per coordinata."],
          steps: [`dim ℝ^${n} = ${n}`],
        };
      },
    },
    {
      level: "Medio",
      title: "Indipendenza in ℝ² (determinante)",
      make: () => {
        const dep = Math.random() < 0.4;
        const u = [nz(-4, 4), nz(-4, 4)];
        const v = dep ? [u[0] * 2, u[1] * 2] : [nz(-4, 4), nz(-4, 4)];
        const det = u[0] * v[1] - u[1] * v[0];
        return {
          prompt: (<span>I vettori <Formula tex={`(${u[0]}, ${u[1]})`} /> e <Formula tex={`(${v[0]}, ${v[1]})`} /> sono indipendenti (1) o dipendenti (0)?</span>),
          expected: [det !== 0 ? 1 : 0],
          solutionText: det !== 0 ? "1 (indipendenti)" : "0 (dipendenti)",
          placeholder: "0 oppure 1",
          hints: ["Calcola il determinante 2×2; se ≠ 0 sono indipendenti."],
          steps: [`det = ${u[0]}·${v[1]} − ${u[1]}·${v[0]} = ${det}`, det !== 0 ? "≠ 0 → indipendenti" : "= 0 → dipendenti"],
        };
      },
    },
  ],

  Matrici: [
    {
      level: "Facile",
      title: "Determinante 2×2",
      make: () => {
        const m = [rint(-5, 5), rint(-5, 5), rint(-5, 5), rint(-5, 5)];
        const det = m[0] * m[3] - m[1] * m[2];
        return {
          prompt: (<span>Calcola <Formula tex={`\\det\\begin{pmatrix}${m[0]}&${m[1]}\\\\${m[2]}&${m[3]}\\end{pmatrix}`} />.</span>),
          expected: [det],
          solutionText: `${det}`,
          placeholder: "es. 5",
          hints: ["ad − bc."],
          steps: [`${m[0]}·${m[3]} − ${m[1]}·${m[2]} = ${det}`],
        };
      },
    },
    {
      level: "Medio",
      title: "Elemento del prodotto (riga·colonna)",
      make: () => {
        const r = [rint(-4, 4), rint(-4, 4), rint(-4, 4)];
        const c = [rint(-4, 4), rint(-4, 4), rint(-4, 4)];
        const val = r[0] * c[0] + r[1] * c[1] + r[2] * c[2];
        return {
          prompt: (<span>Prodotto riga per colonna: <Formula tex={`(${r[0]}, ${r[1]}, ${r[2]}) \\cdot (${c[0]}, ${c[1]}, ${c[2]})^T`} />.</span>),
          expected: [val],
          solutionText: `${val}`,
          placeholder: "es. 5",
          hints: ["Somma dei prodotti degli elementi corrispondenti."],
          steps: [`${r[0]}·${c[0]} + ${r[1]}·${c[1]} + ${r[2]}·${c[2]} = ${val}`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Potenza di una matrice (A²)",
      make: () => {
        const a = rint(-3, 3), b = rint(-3, 3), c = rint(-3, 3), d = rint(-3, 3);
        const e11 = a * a + b * c, e12 = a * b + b * d, e21 = c * a + d * c, e22 = c * b + d * d;
        return {
          prompt: (<span>Calcola <Formula tex={`A^2`} /> con <Formula tex={`A=\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}`} />. Scrivi i 4 elementi in ordine: a₁₁, a₁₂, a₂₁, a₂₂.</span>),
          expected: [e11, e12, e21, e22],
          solutionText: `(${e11}, ${e12}, ${e21}, ${e22})`,
          placeholder: "es. 7,1,2,0",
          hints: ["A² = A·A (prodotto righe per colonne).", `a₁₁ = ${a}·${a} + ${b}·${c}`],
          steps: [`a₁₁ = ${a}·${a} + ${b}·${c} = ${e11}`, `a₁₂ = ${a}·${b} + ${b}·${d} = ${e12}`, `a₂₁ = ${c}·${a} + ${d}·${c} = ${e21}`, `a₂₂ = ${c}·${b} + ${d}·${d} = ${e22}`],
        };
      },
    },
  ],

  "Trasformazioni lineari": [
    {
      level: "Facile",
      title: "Immagine di e₁",
      make: () => {
        const A = [rint(-3, 3), rint(-3, 3), rint(-3, 3), rint(-3, 3)];
        return {
          prompt: (<span>Data <Formula tex={`A=\\begin{pmatrix}${A[0]}&${A[1]}\\\\${A[2]}&${A[3]}\\end{pmatrix}`} />, quanto vale <Formula tex="A\\,\\vec e_1" /> (immagine di (1,0))? Scrivi (x, y).</span>),
          expected: [A[0], A[2]],
          solutionText: `(${A[0]}, ${A[2]})`,
          placeholder: "es. 2,1",
          hints: ["A·e₁ è la prima colonna di A."],
          steps: [`prima colonna: (${A[0]}, ${A[2]})`],
        };
      },
    },
    {
      level: "Medio",
      title: "Teorema del rango",
      make: () => {
        const n = rint(2, 4);
        const k = rint(0, n);
        return {
          prompt: (<span>Se <Formula tex={`\\dim V = ${n}`} /> e <Formula tex={`\\dim\\ker(T) = ${k}`} />, quanto vale <Formula tex="\\dim\\operatorname{Im}(T)" />?</span>),
          expected: [n - k],
          solutionText: `${n - k}`,
          placeholder: "es. 2",
          hints: ["dim Im = dim V − dim ker."],
          steps: [`${n} − ${k} = ${n - k}`],
        };
      },
    },
  ],

  "Sistemi lineari": [
    {
      level: "Medio",
      title: "Sistema 2×2",
      make: () => {
        const x = rint(-4, 4), y = rint(-4, 4);
        let a1 = nz(-3, 3), b1 = nz(-3, 3), a2 = nz(-3, 3), b2 = nz(-3, 3);
        while (a1 * b2 - a2 * b1 === 0) { b2 = nz(-3, 3); a2 = nz(-3, 3); }
        const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
        return {
          prompt: (<span>Risolvi <Formula tex={`\\begin{cases}${a1}x + ${b1}y = ${c1}\\\\ ${a2}x + ${b2}y = ${c2}\\end{cases}`} />. Scrivi (x, y).</span>),
          expected: [x, y],
          solutionText: `(${x}, ${y})`,
          placeholder: "es. 1,2",
          hints: ["Elimina un'incognita combinando le due equazioni.", "Oppure usa Cramer."],
          steps: [`det = ${a1}·${b2} − ${a2}·${b1} = ${a1 * b2 - a2 * b1}`, `x = ${x}, y = ${y}`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Sistema parametrico (quando manca l'unicità)",
      make: () => {
        const b = nz(-4, 4), c = nz(-4, 4);
        const k = b * c;
        return {
          prompt: (<span>Per quale valore di <Formula tex="k" /> il sistema con matrice dei coefficienti <Formula tex={`\\begin{pmatrix}1&${b}\\\\${c}&k\\end{pmatrix}`} /> NON ha soluzione unica (det = 0)?</span>),
          expected: [k],
          solutionText: `k = ${k}`,
          placeholder: "es. 6",
          hints: ["Imponi il determinante uguale a 0.", `det = 1·k − (${b})·(${c})`],
          steps: [`det = 1·k − (${b})·(${c}) = k − ${k}`, `k − ${k} = 0 → k = ${k}`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Sistema 3×3",
      make: () => {
        const x = rint(-3, 3), y = rint(-3, 3), z = rint(-3, 3);
        let M: number[][];
        do {
          M = [0, 1, 2].map(() => [rint(-3, 3), rint(-3, 3), rint(-3, 3)]);
        } while (det3(M) === 0);
        const rhs = M.map((r) => r[0] * x + r[1] * y + r[2] * z);
        const tex = `\\begin{cases}${M[0][0]}x ${M[0][1] >= 0 ? "+ " + M[0][1] : "− " + -M[0][1]}y ${M[0][2] >= 0 ? "+ " + M[0][2] : "− " + -M[0][2]}z = ${rhs[0]}\\\\ ${M[1][0]}x ${M[1][1] >= 0 ? "+ " + M[1][1] : "− " + -M[1][1]}y ${M[1][2] >= 0 ? "+ " + M[1][2] : "− " + -M[1][2]}z = ${rhs[1]}\\\\ ${M[2][0]}x ${M[2][1] >= 0 ? "+ " + M[2][1] : "− " + -M[2][1]}y ${M[2][2] >= 0 ? "+ " + M[2][2] : "− " + -M[2][2]}z = ${rhs[2]}\\end{cases}`;
        return {
          prompt: (<span>Risolvi <Formula tex={tex} />. Scrivi (x, y, z).</span>),
          expected: [x, y, z],
          solutionText: `(${x}, ${y}, ${z})`,
          placeholder: "es. 1,-2,3",
          hints: ["Usa l'eliminazione di Gauss (scheda Calcolatore) o la regola di Cramer.", `det della matrice = ${det3(M)} ≠ 0 → soluzione unica`],
          steps: [`det ≠ 0 → soluzione unica`, `(x, y, z) = (${x}, ${y}, ${z})`],
        };
      },
    },
  ],

  Determinanti: [
    {
      level: "Facile",
      title: "Determinante 2×2",
      make: () => {
        const m = [rint(-6, 6), rint(-6, 6), rint(-6, 6), rint(-6, 6)];
        const det = m[0] * m[3] - m[1] * m[2];
        return {
          prompt: (<span>Calcola <Formula tex={`\\det\\begin{pmatrix}${m[0]}&${m[1]}\\\\${m[2]}&${m[3]}\\end{pmatrix}`} />.</span>),
          expected: [det],
          solutionText: `${det}`,
          placeholder: "es. -2",
          hints: ["ad − bc."],
          steps: [`${m[0]}·${m[3]} − ${m[1]}·${m[2]} = ${det}`],
        };
      },
    },
    {
      level: "Medio",
      title: "Determinante 3×3 (diagonale)",
      make: () => {
        const d = [nz(-4, 4), nz(-4, 4), nz(-4, 4)];
        return {
          prompt: (<span>Determinante della matrice diagonale <Formula tex={`\\operatorname{diag}(${d[0]}, ${d[1]}, ${d[2]})`} />?</span>),
          expected: [d[0] * d[1] * d[2]],
          solutionText: `${d[0] * d[1] * d[2]}`,
          placeholder: "es. 24",
          hints: ["Prodotto degli elementi diagonali."],
          steps: [`${d[0]}·${d[1]}·${d[2]} = ${d[0] * d[1] * d[2]}`],
        };
      },
    },
  ],

  "Autovalori e autovettori": [
    {
      level: "Medio",
      title: "Autovalori (matrice triangolare)",
      make: () => {
        let l1 = rint(-4, 5), l2 = rint(-4, 5);
        if (l1 > l2) [l1, l2] = [l2, l1];
        const off = rint(-3, 3);
        return {
          prompt: (<span>Autovalori di <Formula tex={`\\begin{pmatrix}${l1}&${off}\\\\0&${l2}\\end{pmatrix}`} />? Scrivili in ordine crescente, separati da virgola.</span>),
          expected: [l1, l2],
          solutionText: `${l1}, ${l2}`,
          placeholder: "es. 1,3",
          hints: ["Per una matrice triangolare gli autovalori sono sulla diagonale."],
          steps: [`diagonale: ${l1} e ${l2}`],
        };
      },
    },
    {
      level: "Difficile",
      title: "È diagonalizzabile?",
      make: () => {
        const same = Math.random() < 0.5;
        const l1 = rint(-3, 4);
        let l2 = same ? l1 : rint(-3, 4);
        if (!same && l1 === l2) l2 = l1 + 1;
        const off = same ? nz(-3, 3) : rint(-3, 3);
        const diag = l1 !== l2 || off === 0;
        return {
          prompt: (<span>La matrice <Formula tex={`\\begin{pmatrix}${l1}&${off}\\\\0&${l2}\\end{pmatrix}`} /> è diagonalizzabile? Rispondi 1 (sì) o 0 (no).</span>),
          expected: [diag ? 1 : 0],
          solutionText: diag ? "1 (sì)" : "0 (no)",
          placeholder: "0 oppure 1",
          hints: ["Gli autovalori sono sulla diagonale (matrice triangolare).", "Due autovalori distinti → sì; autovalore doppio con matrice non diagonale → no."],
          steps: [`autovalori: ${l1} e ${l2}`, l1 !== l2 ? "distinti → diagonalizzabile (1)" : off === 0 ? "uguali ma matrice già diagonale → sì (1)" : "autovalore doppio con blocco non diagonale → NON diagonalizzabile (0)"],
        };
      },
    },
  ],

  "Cambiamenti di base": [
    {
      level: "Medio",
      title: "Coordinate nel nuovo riferimento",
      make: () => {
        // B = [[1,-1],[1,1]], O' = (1,0). Genero P' interi e ricavo P.
        const m = rint(-3, 3), n = rint(-3, 3);
        const Px = m - n + 1, Py = m + n;
        return {
          prompt: (<span>Riferimento nuovo: O'=(1,0), i'=(1,1), j'=(−1,1). Quali sono le coordinate <Formula tex="P'" /> del punto <Formula tex={`P=(${Px}, ${Py})`} />? Scrivi (x', y').</span>),
          expected: [m, n],
          solutionText: `(${m}, ${n})`,
          placeholder: "es. 2,0",
          hints: ["P − O' e poi moltiplica per B⁻¹ = ½[[1,1],[−1,1]].", `P − O' = (${Px - 1}, ${Py})`],
          steps: [`P − O' = (${Px - 1}, ${Py})`, `x' = ((${Px - 1}) + (${Py}))/2 = ${m}`, `y' = (−(${Px - 1}) + (${Py}))/2 = ${n}`],
        };
      },
    },
  ],

  "Proiezioni e distanze": [
    {
      level: "Medio",
      title: "Distanza punto–retta (norma 5)",
      make: () => {
        const c = rint(-6, 6);
        const Px = rint(-4, 4), Py = rint(-4, 4);
        const num = 3 * Px + 4 * Py + c;
        const dist = Math.abs(num) / 5;
        return {
          prompt: (<span>Distanza del punto <Formula tex={`(${Px}, ${Py})`} /> dalla retta <Formula tex={`3x + 4y ${c >= 0 ? "+ " + c : "− " + -c} = 0`} />?</span>),
          expected: [dist],
          solutionText: `${Math.abs(num)}/5 = ${Math.round(dist * 1000) / 1000}`,
          placeholder: "es. 2.6 o 13/5",
          hints: ["|3x+4y+c| diviso √(9+16)=5."],
          steps: [`numeratore = |3·${Px} + 4·${Py} ${c >= 0 ? "+ " + c : "− " + -c}| = ${Math.abs(num)}`, `distanza = ${Math.abs(num)} / 5 = ${Math.round(dist * 1000) / 1000}`],
        };
      },
    },
  ],

  Riflessioni: [
    {
      level: "Facile",
      title: "Riflessione rispetto a un asse",
      make: () => {
        const type = pick(["x", "y", "yx"] as const);
        const P = [rint(-5, 5), rint(-5, 5)];
        const res = type === "x" ? [P[0], -P[1]] : type === "y" ? [-P[0], P[1]] : [P[1], P[0]];
        const label = type === "x" ? "l'asse x" : type === "y" ? "l'asse y" : "la bisettrice y = x";
        return {
          prompt: (<span>Rifletti <Formula tex={`(${P[0]}, ${P[1]})`} /> rispetto a {label}. Scrivi (x, y).</span>),
          expected: res,
          solutionText: `(${res[0]}, ${res[1]})`,
          placeholder: "es. 3,-1",
          hints: [type === "x" ? "Asse x: (x, −y)." : type === "y" ? "Asse y: (−x, y)." : "y = x: scambia le coordinate."],
          steps: [`(${P[0]}, ${P[1]}) → (${res[0]}, ${res[1]})`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Riflessione rispetto a una retta",
      make: () => {
        // retta x + y + c = 0 ; norm 2
        const c = rint(-4, 4);
        const Px = rint(-4, 4), Py = rint(-4, 4);
        const s = (Px + Py + c) / 2; // (a x + b y + c)/(a²+b²) con a=b=1
        const rx = Px - 2 * s * 1;
        const ry = Py - 2 * s * 1;
        return {
          prompt: (<span>Rifletti <Formula tex={`P=(${Px}, ${Py})`} /> rispetto alla retta <Formula tex={`x + y ${c >= 0 ? "+ " + c : "− " + -c} = 0`} />. Scrivi (x', y').</span>),
          expected: [rx, ry],
          solutionText: `(${rx}, ${ry})`,
          placeholder: "es. 2,-1",
          hints: ["P' = P − 2·(x+y+c)/2·(1,1).", `(x+y+c) = ${Px + Py + c}`],
          steps: [`fattore = (${Px} + ${Py} ${c >= 0 ? "+ " + c : "− " + -c}) / 2 = ${s}`, `P' = (${Px}, ${Py}) − 2·${s}·(1,1) = (${rx}, ${ry})`],
        };
      },
    },
    {
      level: "Difficile",
      title: "Due riflessioni = rotazione",
      make: () => {
        const a = rint(0, 5) * 30;
        let b = rint(0, 5) * 30;
        while (b === a) b = rint(0, 5) * 30;
        const lo = Math.min(a, b), hi = Math.max(a, b);
        const rot = 2 * (hi - lo);
        return {
          prompt: (<span>La composizione di due riflessioni rispetto a rette per l'origine inclinate di <Formula tex={`${lo}^\\circ`} /> e <Formula tex={`${hi}^\\circ`} /> è una rotazione. Di quanti gradi?</span>),
          expected: [rot],
          solutionText: `${rot}°`,
          placeholder: "es. 60",
          hints: ["Due riflessioni in rette che formano un angolo θ danno una rotazione di 2θ.", `θ = ${hi} − ${lo} = ${hi - lo}°`],
          steps: [`angolo tra le rette = ${hi} − ${lo} = ${hi - lo}°`, `rotazione = 2 · ${hi - lo} = ${rot}°`],
        };
      },
    },
  ],
};
