import { Formula } from "../components/Formula";
import type { Generator } from "../components/section/ExerciseSet";

const rint = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const nz = (a: number, b: number) => {
  let v = 0;
  while (v === 0) v = rint(a, b);
  return v;
};
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

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
  ],
};
