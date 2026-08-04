import { Fraction, ZERO, ONE } from "./fraction";

export type Mat = Fraction[][];

export function parseMatrix(rows: string[][]): Mat {
  return rows.map((row) => row.map((cell) => Fraction.parse(cell)));
}

export function dims(a: Mat): [number, number] {
  return [a.length, a[0]?.length ?? 0];
}

export function cloneMat(a: Mat): Mat {
  return a.map((row) => row.map((c) => c));
}

export function identity(n: number): Mat {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? ONE : ZERO))
  );
}

export function addMat(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((c, j) => c.add(b[i][j])));
}

export function subMat(a: Mat, b: Mat): Mat {
  return a.map((row, i) => row.map((c, j) => c.sub(b[i][j])));
}

export function scalarMul(k: Fraction, a: Mat): Mat {
  return a.map((row) => row.map((c) => c.mul(k)));
}

export function transpose(a: Mat): Mat {
  const [r, c] = dims(a);
  return Array.from({ length: c }, (_, j) => Array.from({ length: r }, (_, i) => a[i][j]));
}

export function multiplyMat(a: Mat, b: Mat): Mat {
  const [ra, ca] = dims(a);
  const [rb, cb] = dims(b);
  if (ca !== rb) throw new Error("Dimensioni incompatibili per il prodotto");
  const result: Mat = [];
  for (let i = 0; i < ra; i++) {
    const row: Fraction[] = [];
    for (let j = 0; j < cb; j++) {
      let sum = ZERO;
      for (let k = 0; k < ca; k++) sum = sum.add(a[i][k].mul(b[k][j]));
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

export function matToString(a: Mat): string {
  return a.map((row) => row.map((c) => c.toString()).join("\t")).join("\n");
}

// ---------- Determinant (cofactor expansion, with textual steps) ----------

export interface StepResult<T> {
  value: T;
  steps: string[];
}

function minor(a: Mat, row: number, col: number): Mat {
  return a
    .filter((_, i) => i !== row)
    .map((r) => r.filter((_, j) => j !== col));
}

export function determinant(a: Mat): Fraction {
  const n = a.length;
  if (n === 1) return a[0][0];
  if (n === 2) return a[0][0].mul(a[1][1]).sub(a[0][1].mul(a[1][0]));
  let sum = ZERO;
  for (let j = 0; j < n; j++) {
    if (a[0][j].isZero()) continue;
    const sign = j % 2 === 0 ? ONE : ONE.neg();
    sum = sum.add(a[0][j].mul(sign).mul(determinant(minor(a, 0, j))));
  }
  return sum;
}

export function determinantWithSteps(a: Mat): StepResult<Fraction> {
  const n = a.length;
  const steps: string[] = [];

  function rec(m: Mat, depth: number): Fraction {
    const size = m.length;
    const pad = "  ".repeat(depth);
    if (size === 1) return m[0][0];
    if (size === 2) {
      const val = m[0][0].mul(m[1][1]).sub(m[0][1].mul(m[1][0]));
      steps.push(
        `${pad}Regola 2x2: (${m[0][0]})(${m[1][1]}) - (${m[0][1]})(${m[1][0]}) = ${val}`
      );
      return val;
    }
    if (size === 3) {
      const [r0, r1, r2] = m;
      const pos = r0[0].mul(r1[1]).mul(r2[2])
        .add(r0[1].mul(r1[2]).mul(r2[0]))
        .add(r0[2].mul(r1[0]).mul(r2[1]));
      const neg = r0[2].mul(r1[1]).mul(r2[0])
        .add(r0[0].mul(r1[2]).mul(r2[1]))
        .add(r0[1].mul(r1[0]).mul(r2[2]));
      const val = pos.sub(neg);
      steps.push(`${pad}Regola di Sarrus: (${pos}) - (${neg}) = ${val}`);
      return val;
    }
    steps.push(`${pad}Sviluppo di Laplace lungo la prima riga (ordine ${size}):`);
    let sum = ZERO;
    for (let j = 0; j < size; j++) {
      if (m[0][j].isZero()) {
        steps.push(`${pad}  termine ${j + 1}: elemento nullo, si salta`);
        continue;
      }
      const sign = j % 2 === 0 ? ONE : ONE.neg();
      const sub = minor(m, 0, j);
      steps.push(`${pad}  termine ${j + 1}: ${sign.equals(ONE) ? "+" : "-"}(${m[0][j]}) * det(minore ${j + 1})`);
      const subVal = rec(sub, depth + 1);
      sum = sum.add(m[0][j].mul(sign).mul(subVal));
    }
    steps.push(`${pad}=> determinante = ${sum}`);
    return sum;
  }

  if (n === 0) return { value: ONE, steps: ["Matrice vuota: determinante = 1 (convenzione)"] };
  const value = rec(a, 0);
  steps.push(`Determinante finale = ${value}`);
  return { value, steps };
}

// ---------- Gauss-Jordan elimination (row echelon form) ----------

export interface GaussResult {
  matrix: Mat;
  steps: string[];
  swaps: number;
  pivotCols: number[];
}

export function gaussJordan(input: Mat, augmentedCols = 0): GaussResult {
  const m = cloneMat(input);
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  const steps: string[] = [];
  let swaps = 0;
  const pivotCols: number[] = [];
  let pivotRow = 0;
  const workCols = cols - augmentedCols;

  for (let col = 0; col < workCols && pivotRow < rows; col++) {
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!m[r][col].isZero()) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    if (sel !== pivotRow) {
      [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
      swaps++;
      steps.push(`Scambio riga R${pivotRow + 1} <-> R${sel + 1}`);
    }
    const pivot = m[pivotRow][col];
    if (!pivot.equals(ONE)) {
      m[pivotRow] = m[pivotRow].map((c) => c.div(pivot));
      steps.push(`R${pivotRow + 1} -> R${pivotRow + 1} / (${pivot})`);
    }
    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (factor.isZero()) continue;
      m[r] = m[r].map((c, j) => c.sub(factor.mul(m[pivotRow][j])));
      steps.push(`R${r + 1} -> R${r + 1} - (${factor}) * R${pivotRow + 1}`);
    }
    pivotCols.push(col);
    pivotRow++;
  }
  return { matrix: m, steps, swaps, pivotCols };
}

export function rank(a: Mat): number {
  return gaussJordan(a).pivotCols.length;
}

// Eliminazione di Gauss (in avanti): riduce a forma a scala eliminando solo
// gli elementi SOTTO ciascun pivot, senza normalizzare i pivot a 1.
export interface EliminationResult {
  matrix: Mat;
  steps: string[];
  rank: number;
  pivotCols: number[];
}

export function gaussEliminationWithSteps(input: Mat): EliminationResult {
  const m = cloneMat(input);
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  const steps: string[] = [];
  const pivotCols: number[] = [];
  let pivotRow = 0;

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (!m[r][col].isZero()) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    if (sel !== pivotRow) {
      [m[sel], m[pivotRow]] = [m[pivotRow], m[sel]];
      steps.push(`Scambio riga R${pivotRow + 1} <-> R${sel + 1}`);
    }
    const pivot = m[pivotRow][col];
    for (let r = pivotRow + 1; r < rows; r++) {
      if (m[r][col].isZero()) continue;
      const factor = m[r][col].div(pivot);
      m[r] = m[r].map((val, j) => val.sub(factor.mul(m[pivotRow][j])));
      steps.push(`R${r + 1} -> R${r + 1} - (${factor}) * R${pivotRow + 1}`);
    }
    pivotCols.push(col);
    pivotRow++;
  }
  steps.push(`Forma a scala ottenuta. Rango = ${pivotCols.length}.`);
  return { matrix: m, steps, rank: pivotCols.length, pivotCols };
}

// ---------- Inverse ----------

export function inverseWithSteps(a: Mat): StepResult<Mat | null> {
  const n = a.length;
  if (a.some((row) => row.length !== n)) throw new Error("La matrice deve essere quadrata");
  const det = determinant(a);
  const steps: string[] = [`Determinante = ${det}`];
  if (det.isZero()) {
    steps.push("Determinante nullo: la matrice non è invertibile");
    return { value: null, steps };
  }
  const augmented = a.map((row, i) => [...row, ...identity(n)[i]]);
  const { matrix, steps: gSteps } = gaussJordan(augmented, n);
  steps.push("Riduzione di Gauss-Jordan su [A | I]:", ...gSteps);
  const inv = matrix.map((row) => row.slice(n));
  steps.push("Matrice inversa ottenuta nella parte destra.");
  return { value: inv, steps };
}

// ---------- Linear systems ----------

export interface SystemSolution {
  type: "unique" | "infinite" | "none";
  steps: string[];
  solution?: Fraction[];
  parametric?: { particular: Fraction[]; freeVars: number[]; directions: Fraction[][] };
  rankA: number;
  rankAug: number;
  n: number;
}

export function solveSystem(A: Mat, b: Fraction[]): SystemSolution {
  const n = A[0].length;
  const augmented = A.map((row, i) => [...row, b[i]]);
  const steps: string[] = [];
  const { matrix, steps: gSteps, pivotCols } = gaussJordan(augmented, 1);
  steps.push("Riduzione di Gauss-Jordan sulla matrice completa [A | b]:", ...gSteps);

  const rankA = pivotCols.length;
  let rankAug = rankA;
  for (const row of matrix) {
    const allZeroCoeffs = row.slice(0, n).every((c) => c.isZero());
    if (allZeroCoeffs && !row[n].isZero()) {
      rankAug = rankA + 1;
      break;
    }
  }

  steps.push(`Rango(A) = ${rankA}, Rango(A|b) = ${rankAug}, incognite = ${n}`);

  if (rankA !== rankAug) {
    steps.push("Per il teorema di Rouché-Capelli: rango(A) ≠ rango(A|b) => sistema impossibile.");
    return { type: "none", steps, rankA, rankAug, n };
  }

  if (rankA === n) {
    const solution = new Array(n).fill(ZERO);
    pivotCols.forEach((col, i) => {
      solution[col] = matrix[i][n];
    });
    steps.push("Rango(A) = numero incognite => soluzione unica.");
    steps.push(`Soluzione: (${solution.map((s) => s.toString()).join(", ")})`);
    return { type: "unique", steps, solution, rankA, rankAug, n };
  }

  steps.push("Rango(A) < numero incognite => infinite soluzioni (∞^" + (n - rankA) + ").");
  const freeVars: number[] = [];
  for (let c = 0; c < n; c++) if (!pivotCols.includes(c)) freeVars.push(c);

  const particular = new Array(n).fill(ZERO);
  pivotCols.forEach((col, i) => {
    particular[col] = matrix[i][n];
  });

  const directions: Fraction[][] = freeVars.map((fv) => {
    const dir = new Array(n).fill(ZERO);
    dir[fv] = ONE;
    pivotCols.forEach((col, i) => {
      dir[col] = matrix[i][fv].neg();
    });
    return dir;
  });

  steps.push(
    `Variabili libere: ${freeVars.map((f) => `x${f + 1}`).join(", ")}`
  );

  return {
    type: "infinite",
    steps,
    parametric: { particular, freeVars, directions },
    rankA,
    rankAug,
    n,
  };
}
