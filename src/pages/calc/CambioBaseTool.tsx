import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { MatrixDisplay } from "../../components/MatrixDisplay";
import { FramePlane2D } from "../../components/FramePlane2D";
import { FramePlane3D } from "../../components/FramePlane3D";
import { Steps } from "../../components/Steps";
import { parseMatrix, determinant, inverseWithSteps, subMat, addMat, multiplyMat, type Mat } from "../../lib/matrix";
import { Fraction } from "../../lib/fraction";

const labels = ["i'", "j'", "k'"];
type Dir = "toNew" | "toOld";

export function CambioBaseTool() {
  const [dim, setDim] = useState(2);
  const [dir, setDir] = useState<Dir>("toNew");
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
      const inCol: Mat = Array.from({ length: dim }, (_, i) => [Fraction.parse(pStr[i] || "0")]);

      if (dir === "toNew") {
        // Dato P nel vecchio rif., trova P' = B^{-1}(P - O')
        const inv = inverseWithSteps(B);
        const diff = subMat(inCol, oCol);
        const out = multiplyMat(inv.value!, diff);
        return { mode: "toNew" as const, B, det, oCol, out, inv, diff, pointOld: inCol, pNewCol: out };
      }
      // Dato Q' nel nuovo rif., trova Q = B·Q' + O'
      const prod = multiplyMat(B, inCol);
      const out = addMat(prod, oCol);
      return { mode: "toOld" as const, B, det, oCol, out, prod, pointOld: out, pNewCol: inCol };
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bStr, oStr, pStr, dim, dir]);

  function setVec(setter: (v: string[]) => void, arr: string[], i: number, v: string) {
    const next = Array.from({ length: dim }, (_, k) => arr[k] ?? "0");
    next[i] = v;
    setter(next);
  }

  const toNew = dir === "toNew";

  return (
    <div>
      <div className="btn-row">
        <button className={`tab-btn ${toNew ? "active" : ""}`} onClick={() => setDir("toNew")}>
          Da RIF a RIF' (trova P')
        </button>
        <button className={`tab-btn ${!toNew ? "active" : ""}`} onClick={() => setDir("toOld")}>
          Da RIF' a RIF (trova Q)
        </button>
      </div>

      <p style={{ color: "var(--text-muted)" }}>
        {toNew ? (
          <>
            Scrivi le coordinate di un punto P nel <b>vecchio</b> riferimento e ottieni quelle nel
            nuovo. Formula: <b>P' = B⁻¹ (P − O')</b>, con B che ha per colonne i nuovi versori.
          </>
        ) : (
          <>
            Scrivi le coordinate di un punto Q' nel <b>nuovo</b> riferimento RIF' e ottieni quelle
            nel vecchio. Formula: <b>Q = B·Q' + O'</b> (nessuna inversione necessaria).
          </>
        )}
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
          <p style={{ fontWeight: 600 }}>{toNew ? "Punto P (nel vecchio rif.)" : "Punto Q' (nel nuovo rif.)"}</p>
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
            <MatrixDisplay matrix={result.out} prefix={toNew ? "P' =" : "Q ="} />
            <p style={{ marginTop: "0.4rem" }}>
              {toNew
                ? `Coordinate di P nel nuovo riferimento: (${result.out.map((r) => r[0].toString()).join(", ")})`
                : `Coordinate di Q nel vecchio riferimento: (${result.out.map((r) => r[0].toString()).join(", ")})`}
            </p>
          </div>

          {dim === 2 && (
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
              <FramePlane2D
                oPrime={[result.oCol[0][0].toNumber(), result.oCol[1][0].toNumber()]}
                iPrime={[result.B[0][0].toNumber(), result.B[1][0].toNumber()]}
                jPrime={[result.B[0][1].toNumber(), result.B[1][1].toNumber()]}
                point={[result.pointOld[0][0].toNumber(), result.pointOld[1][0].toNumber()]}
                pNew={[result.pNewCol[0][0].toNumber(), result.pNewCol[1][0].toNumber()]}
                pointLabel={toNew ? "P" : "Q"}
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
                point={[result.pointOld[0][0].toNumber(), result.pointOld[1][0].toNumber(), result.pointOld[2][0].toNumber()]}
                pNew={[result.pNewCol[0][0].toNumber(), result.pNewCol[1][0].toNumber(), result.pNewCol[2][0].toNumber()]}
                pointLabel={toNew ? "P" : "Q"}
              />
            </div>
          )}

          {result.mode === "toNew" ? (
            <>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", margin: "0.5rem 0" }}>
                <MatrixDisplay matrix={result.inv.value!} prefix="B^{-1} =" />
                <MatrixDisplay matrix={result.diff} prefix="P - O' =" />
              </div>
              <Steps steps={[`det B = ${result.det}`, ...result.inv.steps]} title="Passaggi (inversione di B)" />
            </>
          ) : (
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", margin: "0.5rem 0" }}>
              <MatrixDisplay matrix={result.prod} prefix="B \cdot Q' =" />
              <MatrixDisplay matrix={result.oCol} prefix="O' =" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
