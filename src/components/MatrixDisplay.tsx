import type { Mat } from "../lib/matrix";
import type { Fraction } from "../lib/fraction";
import { Formula } from "./Formula";

function fracToLatex(f: Fraction): string {
  if (f.den === 1) return `${f.num}`;
  const sign = f.num < 0 ? "-" : "";
  return `${sign}\\frac{${Math.abs(f.num)}}{${f.den}}`;
}

interface Props {
  matrix: Mat;
  prefix?: string; // es. "A^{-1} =" reso prima della matrice
  bracket?: "p" | "b"; // parentesi tonde (default) o quadre
}

export function MatrixDisplay({ matrix, prefix, bracket = "p" }: Props) {
  const env = bracket === "b" ? "bmatrix" : "pmatrix";
  const body = matrix.map((row) => row.map(fracToLatex).join(" & ")).join(" \\\\ ");
  const tex = `${prefix ? prefix + " " : ""}\\begin{${env}} ${body} \\end{${env}}`;
  return <Formula block tex={tex} />;
}
