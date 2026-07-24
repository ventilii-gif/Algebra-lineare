import { useMemo, useState } from "react";
import { MatrixDisplay } from "../../components/MatrixDisplay";
import { LineProjectionPlot } from "../../components/LineProjectionPlot";
import { LineProjectionPlot3D } from "../../components/LineProjectionPlot3D";
import { PlaneProjectionPlot } from "../../components/PlaneProjectionPlot";
import { Steps } from "../../components/Steps";
import { Fraction, ZERO } from "../../lib/fraction";
import type { Mat } from "../../lib/matrix";

type Mode = "retta" | "piano" | "rettaAB";

function absF(f: Fraction): Fraction {
  return f.num < 0 ? f.neg() : f;
}

export function ProiezioniTool() {
  const [mode, setMode] = useState<Mode>("retta");
  // retta ax+by+c=0, punto (px,py)
  const [line, setLine] = useState<string[]>(["3", "4", "-5"]);
  const [p2, setP2] = useState<string[]>(["2", "3"]);
  // piano ax+by+cz+d=0, punto (px,py,pz)
  const [plane, setPlane] = useState<string[]>(["2", "-1", "2", "-6"]);
  const [p3, setP3] = useState<string[]>(["4", "1", "3"]);
  // retta per A, B (metodo vettoriale)
  const [abDim, setAbDim] = useState(2);
  const [aVec, setAVec] = useState<string[]>(["3", "-1", "0"]);
  const [bVec, setBVec] = useState<string[]>(["7", "-4", "0"]);
  const [p0Vec, setP0Vec] = useState<string[]>(["2", "3", "0"]);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const F = (s: string) => Fraction.parse(s || "0");
      if (mode === "retta") {
        const [a, b, c] = line.map(F);
        const [x0, y0] = p2.map(F);
        const num = a.mul(x0).add(b.mul(y0)).add(c);
        const denom = a.mul(a).add(b.mul(b));
        if (denom.isZero()) {
          setError("Retta non valida: (a, b) non può essere il vettore nullo.");
          return null;
        }
        const s = num.div(denom);
        const H: Mat = [[x0.sub(s.mul(a))], [y0.sub(s.mul(b))]];
        const dist = Math.abs(num.toNumber()) / Math.sqrt(denom.toNumber());
        return { mode, num, denom, H, dist, coeffs: [a, b, c], point: [x0, y0] } as const;
      }
      if (mode === "piano") {
        const [a, b, c, d] = plane.map(F);
        const [x0, y0, z0] = p3.map(F);
        const num = a.mul(x0).add(b.mul(y0)).add(c.mul(z0)).add(d);
        const denom = a.mul(a).add(b.mul(b)).add(c.mul(c));
        if (denom.isZero()) {
          setError("Piano non valido: (a, b, c) non può essere il vettore nullo.");
          return null;
        }
        const s = num.div(denom);
        const H: Mat = [[x0.sub(s.mul(a))], [y0.sub(s.mul(b))], [z0.sub(s.mul(c))]];
        const dist = Math.abs(num.toNumber()) / Math.sqrt(denom.toNumber());
        return { mode, num, denom, H, dist, coeffs: [a, b, c, d], point: [x0, y0, z0] } as const;
      }
      // retta per A, B (vettoriale): H = A + ((AP0·v)/(v·v)) v, v = B - A
      const dim = abDim;
      const A = aVec.slice(0, dim).map(F);
      const B = bVec.slice(0, dim).map(F);
      const P0 = p0Vec.slice(0, dim).map(F);
      const v = B.map((bi, i) => bi.sub(A[i]));
      const vv = v.reduce((acc, vi) => acc.add(vi.mul(vi)), ZERO);
      if (vv.isZero()) {
        setError("A e B coincidono: non definiscono una retta.");
        return null;
      }
      const ap0 = P0.map((pi, i) => pi.sub(A[i]));
      const dot = ap0.reduce((acc, ai, i) => acc.add(ai.mul(v[i])), ZERO);
      const t = dot.div(vv);
      const Hv = A.map((ai, i) => ai.add(t.mul(v[i])));
      const H: Mat = Hv.map((h) => [h]);
      const dist = Math.sqrt(P0.reduce((acc, pi, i) => acc + (pi.sub(Hv[i]).toNumber()) ** 2, 0));
      return { mode, dim, t, dot, vv, H, dist, A, B, P0, v } as const;
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [mode, line, p2, plane, p3, abDim, aVec, bVec, p0Vec]);

  function setCell(arr: string[], setter: (v: string[]) => void, i: number, val: string) {
    const next = [...arr];
    next[i] = val;
    setter(next);
  }

  return (
    <div>
      <div className="btn-row">
        <button className={`tab-btn ${mode === "retta" ? "active" : ""}`} onClick={() => setMode("retta")}>
          Punto–retta (R²)
        </button>
        <button className={`tab-btn ${mode === "piano" ? "active" : ""}`} onClick={() => setMode("piano")}>
          Punto–piano (R³)
        </button>
        <button className={`tab-btn ${mode === "rettaAB" ? "active" : ""}`} onClick={() => setMode("rettaAB")}>
          Retta per A, B (vettoriale)
        </button>
      </div>

      {mode === "retta" && (
        <p style={{ color: "var(--text-muted)" }}>
          Retta <b>a·x + b·y + c = 0</b> e punto P: proiezione H e distanza.
        </p>
      )}
      {mode === "piano" && (
        <p style={{ color: "var(--text-muted)" }}>
          Piano <b>a·x + b·y + c·z + d = 0</b> e punto P: proiezione H e distanza.
        </p>
      )}
      {mode === "rettaAB" && (
        <p style={{ color: "var(--text-muted)" }}>
          Retta passante per i punti A e B, e punto P₀: proiezione di P₀ sulla retta. Formula{" "}
          <b>H = A + ((AP₀·v)/(v·v))·v</b>, con v = B − A.
        </p>
      )}

      {/* input: retta ax+by+c / piano */}
      {(mode === "retta" || mode === "piano") && (
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={{ fontWeight: 600 }}>Coefficienti {mode === "retta" ? "(a, b, c)" : "(a, b, c, d)"}</p>
            <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${mode === "retta" ? 3 : 4}, auto)` }}>
              {(mode === "retta" ? line : plane).map((val, i) => (
                <input
                  key={i}
                  className="matrix-cell"
                  value={val}
                  onChange={(e) => (mode === "retta" ? setCell(line, setLine, i, e.target.value) : setCell(plane, setPlane, i, e.target.value))}
                />
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600 }}>Punto P {mode === "retta" ? "(x, y)" : "(x, y, z)"}</p>
            <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
              {(mode === "retta" ? p2 : p3).map((val, i) => (
                <input
                  key={i}
                  className="matrix-cell"
                  value={val}
                  onChange={(e) => (mode === "retta" ? setCell(p2, setP2, i, e.target.value) : setCell(p3, setP3, i, e.target.value))}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* input: retta per A, B */}
      {mode === "rettaAB" && (
        <>
          <div className="btn-row">
            {[2, 3].map((n) => (
              <button key={n} className={`tab-btn ${abDim === n ? "active" : ""}`} onClick={() => setAbDim(n)}>
                {n}D
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "start" }}>
            {([["A", aVec, setAVec], ["B", bVec, setBVec], ["P₀", p0Vec, setP0Vec]] as const).map(([label, arr, setter]) => (
              <div key={label}>
                <p style={{ fontWeight: 600 }}>{label}</p>
                <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
                  {Array.from({ length: abDim }, (_, i) => (
                    <input key={i} className="matrix-cell" value={arr[i] ?? "0"} onChange={(e) => setCell(arr, setter, i, e.target.value)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {error && <div className="result-box error">{error}</div>}

      {result && (
        <>
          <div className="result-box">
            <MatrixDisplay matrix={result.H} prefix="H =" />
            <p style={{ marginTop: "0.4rem" }}>
              Proiezione: ({result.H.map((r) => r[0].toString()).join(", ")}) · Distanza d ={" "}
              {Math.round(result.dist * 1e6) / 1e6}
            </p>
          </div>

          {result.mode === "retta" && (
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
              <LineProjectionPlot a={result.coeffs[0].toNumber()} b={result.coeffs[1].toNumber()} c={result.coeffs[2].toNumber()} point={[result.point[0].toNumber(), result.point[1].toNumber()]} />
            </div>
          )}

          {result.mode === "piano" && (
            <div style={{ margin: "1rem 0" }}>
              <PlaneProjectionPlot a={result.coeffs[0].toNumber()} b={result.coeffs[1].toNumber()} c={result.coeffs[2].toNumber()} d={result.coeffs[3].toNumber()} point={[result.point[0].toNumber(), result.point[1].toNumber(), result.point[2].toNumber()]} />
            </div>
          )}

          {result.mode === "rettaAB" && result.dim === 2 && (() => {
            const Ax = result.A[0].toNumber(), Ay = result.A[1].toNumber();
            const vx = result.v[0].toNumber(), vy = result.v[1].toNumber();
            // retta per A con direzione v: normale (vy, -vx) => vy·x - vx·y + (-vy·Ax + vx·Ay) = 0
            const a = vy, b = -vx, c = -vy * Ax + vx * Ay;
            return (
              <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
                <LineProjectionPlot
                  a={a} b={b} c={c}
                  point={[result.P0[0].toNumber(), result.P0[1].toNumber()]}
                  markers={[
                    { p: [Ax, Ay], label: "A" },
                    { p: [result.B[0].toNumber(), result.B[1].toNumber()], label: "B" },
                  ]}
                />
              </div>
            );
          })()}

          {result.mode === "rettaAB" && result.dim === 3 && (
            <div style={{ margin: "1rem 0" }}>
              <LineProjectionPlot3D
                A={[result.A[0].toNumber(), result.A[1].toNumber(), result.A[2].toNumber()]}
                B={[result.B[0].toNumber(), result.B[1].toNumber(), result.B[2].toNumber()]}
                P0={[result.P0[0].toNumber(), result.P0[1].toNumber(), result.P0[2].toNumber()]}
              />
            </div>
          )}

          {result.mode === "rettaAB" ? (
            <Steps
              title="Passaggi (metodo vettoriale)"
              steps={[
                `v = B − A = (${result.v.map((x) => x.toString()).join(", ")})`,
                `AP₀ · v = ${result.dot}`,
                `v · v = ${result.vv}`,
                `t = (AP₀·v)/(v·v) = ${result.t}`,
                `H = A + t·v = (${result.H.map((r) => r[0].toString()).join(", ")})`,
                `d = |P₀ − H| ≈ ${Math.round(result.dist * 1e6) / 1e6}`,
              ]}
            />
          ) : (
            <Steps
              title="Passaggi"
              steps={[
                `Valuto l'equazione in P: numeratore = ${result.num}`,
                `Norma² della normale = ${result.denom}`,
                `Distanza = |${result.num}| / √(${result.denom}) = ${absF(result.num)} / √(${result.denom}) ≈ ${Math.round(result.dist * 1e6) / 1e6}`,
                `Proiezione: H = P − (numeratore / norma²) · normale`,
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}
