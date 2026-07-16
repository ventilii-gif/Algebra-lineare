// Numeric (floating point) eigenvalue/eigenvector computation for 2x2 and 3x3 matrices.
// Eigenvalues are generally irrational, so this module works with plain numbers rather
// than exact fractions.

export type NumMat = number[][];

export interface Complex {
  re: number;
  im: number;
}

export function complexToString(c: Complex, digits = 4): string {
  const re = round(c.re, digits);
  const im = round(c.im, digits);
  if (Math.abs(im) < 1e-9) return `${re}`;
  const sign = im >= 0 ? "+" : "-";
  return `${re} ${sign} ${Math.abs(im)}i`;
}

function round(x: number, digits = 6): number {
  const f = Math.pow(10, digits);
  const r = Math.round(x * f) / f;
  return Object.is(r, -0) ? 0 : r;
}

export interface EigenResult {
  eigenvalues: Complex[];
  charPolySteps: string[];
}

export function trace(a: NumMat): number {
  return a.reduce((s, row, i) => s + row[i], 0);
}

export function det2(a: NumMat): number {
  return a[0][0] * a[1][1] - a[0][1] * a[1][0];
}

export function det3(a: NumMat): number {
  return (
    a[0][0] * a[1][1] * a[2][2] +
    a[0][1] * a[1][2] * a[2][0] +
    a[0][2] * a[1][0] * a[2][1] -
    a[0][2] * a[1][1] * a[2][0] -
    a[0][0] * a[1][2] * a[2][1] -
    a[0][1] * a[1][0] * a[2][2]
  );
}

export function eigenvalues2x2(a: NumMat): EigenResult {
  const tr = trace(a);
  const d = det2(a);
  const disc = tr * tr - 4 * d;
  const steps = [
    `Polinomio caratteristico: λ² - (tr A)λ + det(A) = λ² - (${round(tr)})λ + (${round(d)})`,
    `Discriminante Δ = (tr A)² - 4·det(A) = ${round(tr)}² - 4·(${round(d)}) = ${round(disc)}`,
  ];
  let l1: Complex, l2: Complex;
  if (disc >= 0) {
    const sq = Math.sqrt(disc);
    l1 = { re: (tr + sq) / 2, im: 0 };
    l2 = { re: (tr - sq) / 2, im: 0 };
    steps.push(`Δ ≥ 0: autovalori reali λ = (tr A ± √Δ) / 2`);
  } else {
    const sq = Math.sqrt(-disc);
    l1 = { re: tr / 2, im: sq / 2 };
    l2 = { re: tr / 2, im: -sq / 2 };
    steps.push(`Δ < 0: autovalori complessi coniugati λ = (tr A ± i√(-Δ)) / 2`);
  }
  steps.push(`λ1 = ${complexToString(l1)}, λ2 = ${complexToString(l2)}`);
  return { eigenvalues: [l1, l2], charPolySteps: steps };
}

// General cubic solver for λ^3 + b λ^2 + c λ + d = 0 (Cardano / trigonometric method)
function solveCubic(b: number, c: number, d: number): Complex[] {
  const p = c - (b * b) / 3;
  const q = (2 * b * b * b) / 27 - (b * c) / 3 + d;
  const shift = -b / 3;
  const disc = (q * q) / 4 + (p * p * p) / 27;

  if (Math.abs(p) < 1e-12 && Math.abs(q) < 1e-12) {
    return [
      { re: shift, im: 0 },
      { re: shift, im: 0 },
      { re: shift, im: 0 },
    ];
  }

  if (disc > 1e-9) {
    const sq = Math.sqrt(disc);
    const u = Math.cbrt(-q / 2 + sq);
    const v = Math.cbrt(-q / 2 - sq);
    const t = u + v;
    const re = shift + t;
    const imPart = ((u - v) * Math.sqrt(3)) / 2;
    const reOther = shift - t / 2;
    return [
      { re, im: 0 },
      { re: reOther, im: imPart },
      { re: reOther, im: -imPart },
    ];
  }

  if (disc < -1e-9) {
    const r = Math.sqrt((-p * p * p) / 27);
    const phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r))));
    const m = 2 * Math.sqrt(-p / 3);
    const roots = [0, 1, 2].map((k) => shift + m * Math.cos((phi + 2 * Math.PI * k) / 3));
    return roots.map((re) => ({ re, im: 0 }));
  }

  // disc ~ 0: multiple real roots
  const u = Math.cbrt(-q / 2);
  return [
    { re: shift + 2 * u, im: 0 },
    { re: shift - u, im: 0 },
    { re: shift - u, im: 0 },
  ];
}

export function eigenvalues3x3(a: NumMat): EigenResult {
  const tr = trace(a);
  const minorSum =
    (a[0][0] * a[1][1] - a[0][1] * a[1][0]) +
    (a[0][0] * a[2][2] - a[0][2] * a[2][0]) +
    (a[1][1] * a[2][2] - a[1][2] * a[2][1]);
  const d = det3(a);
  const steps = [
    `Polinomio caratteristico: -λ³ + (tr A)λ² - (Σ minori principali 2x2)λ + det(A) = 0`,
    `tr A = ${round(tr)}, Σ minori principali = ${round(minorSum)}, det A = ${round(d)}`,
    `Forma equivalente: λ³ - (${round(tr)})λ² + (${round(minorSum)})λ - (${round(d)}) = 0`,
  ];
  const roots = solveCubic(-tr, minorSum, -d);
  steps.push(`Radici: ${roots.map((r) => complexToString(r)).join(", ")}`);
  return { eigenvalues: roots, charPolySteps: steps };
}

// Null space of (A - lambda I) via Gaussian elimination with tolerance, for a real eigenvalue.
export function eigenvectorFor(a: NumMat, lambda: number, tol = 1e-6): number[] | null {
  const n = a.length;
  const m = a.map((row, i) => row.map((v, j) => v - (i === j ? lambda : 0)));

  // Gaussian elimination with partial pivoting
  const pivotCols: number[] = [];
  let pr = 0;
  for (let col = 0; col < n && pr < n; col++) {
    let sel = -1;
    let best = tol;
    for (let r = pr; r < n; r++) {
      if (Math.abs(m[r][col]) > best) {
        best = Math.abs(m[r][col]);
        sel = r;
      }
    }
    if (sel === -1) continue;
    [m[sel], m[pr]] = [m[pr], m[sel]];
    const pivot = m[pr][col];
    m[pr] = m[pr].map((v) => v / pivot);
    for (let r = 0; r < n; r++) {
      if (r === pr) continue;
      const factor = m[r][col];
      if (Math.abs(factor) < tol) continue;
      m[r] = m[r].map((v, j) => v - factor * m[pr][j]);
    }
    pivotCols.push(col);
    pr++;
  }

  const freeCols = [];
  for (let c = 0; c < n; c++) if (!pivotCols.includes(c)) freeCols.push(c);
  if (freeCols.length === 0) return null;

  const freeCol = freeCols[0];
  const v = new Array(n).fill(0);
  v[freeCol] = 1;
  pivotCols.forEach((col, i) => {
    v[col] = -m[i][freeCol];
  });

  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return norm > tol ? v.map((x) => round(x / norm, 6)) : v;
}
