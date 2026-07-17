import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { MatrixDisplay } from "../../components/MatrixDisplay";
import { FramePlane2D } from "../../components/FramePlane2D";
import { FramePlane3D } from "../../components/FramePlane3D";
import { Steps } from "../../components/Steps";
import { parseMatrix, determinant, inverseWithSteps, subMat, multiplyMat, type Mat } from "../../lib/matrix";
import { Fraction } from "../../lib/fraction";

const labels = ["i'", "j'", "k'"];

export function CambioBaseTool() {
  const [dim, setDim] = useState(2);
  const [bStr, setBStr] = useState<string[][]>([]);
  const [oStr, setOStr] = useState<string[]>(["0", "0", "0"]);
  const [pStr, setPStr] = useState<string[]>(["0", "0", "0"]);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const B = parseMatrix(bStr);
      if (B.length !== dim || B.some((r) => r.length !== dim)) return null;
      const det = determinant(B);
      if (det.isZero()) {
        setError("La nuova base non è valida: i vettori sono linearmente dipendenti (det B = 0).");
        return null;
      }
      const oCol: Mat = Array.from({ length: dim }, (_, i) => [Fraction.parse(oStr[i] || "0")]);
      const pCol: Mat = Array.from({ length: dim }, (_, i) => [Fraction.parse(pStr[i] || "0")]);
      const inv = inverseWithSteps(B);
      const diff = subMat(pCol, oCol);
      const pNew = multiplyMat(inv.value!, diff);
      return { B, det, oCol, pCol, diff, inv, pNew };
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bStr, oStr, pStr, dim]);

  function setVec(setter: (v: string[]) => void, arr: string[], i: number, v: string) {
    const next = Array.from({ length: dim }, (_, k) => arr[k] ?? "0");
    next[i] = v;
    setter(next);
  }

  return (
    <div>
      <p style={{ color: "var(--text-muted)" }}>
        Scrivi le coordinate di un punto P nel nuovo riferimento RIF' = (O'; i', j', ...), dato il
        riferimento di partenza. Formula: <b>P' = B⁻¹ (P − O')</b>, con B che ha per colonne i nuovi
        versori.
      </p>

      <div className="btn-row">
        {[1, 2, 3].map((n) => (
          <button key={n} className={`tab-btn ${dim === n ? "active" : ""}`} onClick={() => setDim(n)}>
            {n}D
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "start" }}>
        <div>
          <p style={{ fontWeight: 600 }}>Nuova base B (colonne = {labels.slice(0, dim).join(", ")})</p>
          <MatrixInput rows={dim} cols={dim} onChange={setBStr} />
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Origine O' (nel vecchio rif.)</p>
          <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
            {Array.from({ length: dim }, (_, i) => (
              <input key={i} className="matrix-cell" value={oStr[i] ?? "0"} onChange={(e) => setVec(setOStr, oStr, i, e.target.value)} />
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Punto P (nel vecchio rif.)</p>
          <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
            {Array.from({ length: dim }, (_, i) => (
              <input key={i} className="matrix-cell" value={pStr[i] ?? "0"} onChange={(e) => setVec(setPStr, pStr, i, e.target.value)} />
            ))}
          </div>
        </div>
      </div>

      {error && <div className="result-box error">{error}</div>}

      {result && (
        <>
          <div className="result-box">
            <MatrixDisplay matrix={result.pNew} prefix="P' =" />
            <p style={{ marginTop: "0.4rem" }}>
              Coordinate di P nel nuovo riferimento: ({result.pNew.map((r) => r[0].toString()).join(", ")})
            </p>
          </div>

          {dim === 2 && (
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
              <FramePlane2D
                oPrime={[result.oCol[0][0].toNumber(), result.oCol[1][0].toNumber()]}
                iPrime={[result.B[0][0].toNumber(), result.B[1][0].toNumber()]}
                jPrime={[result.B[0][1].toNumber(), result.B[1][1].toNumber()]}
                point={[result.pCol[0][0].toNumber(), result.pCol[1][0].toNumber()]}
                pNew={[result.pNew[0][0].toNumber(), result.pNew[1][0].toNumber()]}
              />
            </div>
          )}

          {dim === 3 && (
            <div style={{ margin: "1rem 0" }}>
              <FramePlane3D
                oPrime={[result.oCol[0][0].toNumber(), result.oCol[1][0].toNumber(), result.oCol[2][0].toNumber()]}
                iPrime={[result.B[0][0].toNumber(), result.B[1][0].toNumber(), result.B[2][0].toNumber()]}
                jPrime={[result.B[0][1].toNumber(), result.B[1][1].toNumber(), result.B[2][1].toNumber()]}
                kPrime={[result.B[0][2].toNumber(), result.B[1][2].toNumber(), result.B[2][2].toNumber()]}
                point={[result.pCol[0][0].toNumber(), result.pCol[1][0].toNumber(), result.pCol[2][0].toNumber()]}
                pNew={[result.pNew[0][0].toNumber(), result.pNew[1][0].toNumber(), result.pNew[2][0].toNumber()]}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", margin: "0.5rem 0" }}>
            <MatrixDisplay matrix={result.inv.value!} prefix="B^{-1} =" />
            <MatrixDisplay matrix={result.diff} prefix="P - O' =" />
          </div>

          <Steps steps={[`det B = ${result.det}`, ...result.inv.steps]} title="Passaggi (inversione di B)" />
        </>
      )}
    </div>
  );
}
