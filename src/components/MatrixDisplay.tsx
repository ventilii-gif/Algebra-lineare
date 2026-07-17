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
  // Spaziatura verticale maggiore quando ci sono frazioni, così numeratori e
  // denominatori di righe adiacenti non si toccano.
  const hasFraction = matrix.some((row) => row.some((c) => c.den !== 1));
  const rowSep = hasFraction ? " \\\\[7pt] " : " \\\\ ";
  const body = matrix.map((row) => row.map(fracToLatex).join(" & ")).join(rowSep);
  const tex = `${prefix ? prefix + " " : ""}\\begin{${env}} ${body} \\end{${env}}`;
  return <Formula block tex={tex} />;
}
