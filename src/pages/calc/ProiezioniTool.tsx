import { useMemo, useState } from "react";
import { MatrixDisplay } from "../../components/MatrixDisplay";
import { LineProjectionPlot } from "../../components/LineProjectionPlot";
import { PlaneProjectionPlot } from "../../components/PlaneProjectionPlot";
import { Steps } from "../../components/Steps";
import { Fraction } from "../../lib/fraction";
import type { Mat } from "../../lib/matrix";

type Mode = "retta" | "piano";

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
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
  }, [mode, line, p2, plane, p3]);

  function setCell(arr: string[], setter: (v: string[]) => void, i: number, v: string) {
    const next = [...arr];
    next[i] = v;
    setter(next);
  }

  const isLine = mode === "retta";

  return (
    <div>
      <div className="btn-row">
        <button className={`tab-btn ${isLine ? "active" : ""}`} onClick={() => setMode("retta")}>
          Punto–retta (R²)
        </button>
        <button className={`tab-btn ${!isLine ? "active" : ""}`} onClick={() => setMode("piano")}>
          Punto–piano (R³)
        </button>
      </div>

      <p style={{ color: "var(--text-muted)" }}>
        {isLine ? (
          <>Retta <b>a·x + b·y + c = 0</b> e punto P: calcola la proiezione H e la distanza.</>
        ) : (
          <>Piano <b>a·x + b·y + c·z + d = 0</b> e punto P: calcola la proiezione H e la distanza.</>
        )}
      </p>

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "start" }}>
        <div>
          <p style={{ fontWeight: 600 }}>Coefficienti {isLine ? "(a, b, c)" : "(a, b, c, d)"}</p>
          <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${isLine ? 3 : 4}, auto)` }}>
            {(isLine ? line : plane).map((v, i) => (
              <input
                key={i}
                className="matrix-cell"
                value={v}
                onChange={(e) => (isLine ? setCell(line, setLine, i, e.target.value) : setCell(plane, setPlane, i, e.target.value))}
              />
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontWeight: 600 }}>Punto P {isLine ? "(x, y)" : "(x, y, z)"}</p>
          <div className="matrix-grid" style={{ gridTemplateColumns: "auto" }}>
            {(isLine ? p2 : p3).map((v, i) => (
              <input
                key={i}
                className="matrix-cell"
                value={v}
                onChange={(e) => (isLine ? setCell(p2, setP2, i, e.target.value) : setCell(p3, setP3, i, e.target.value))}
              />
            ))}
          </div>
        </div>
      </div>

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
              <LineProjectionPlot
                a={result.coeffs[0].toNumber()}
                b={result.coeffs[1].toNumber()}
                c={result.coeffs[2].toNumber()}
                point={[result.point[0].toNumber(), result.point[1].toNumber()]}
              />
            </div>
          )}

          {result.mode === "piano" && (
            <div style={{ margin: "1rem 0" }}>
              <PlaneProjectionPlot
                a={result.coeffs[0].toNumber()}
                b={result.coeffs[1].toNumber()}
                c={result.coeffs[2].toNumber()}
                d={result.coeffs[3].toNumber()}
                point={[result.point[0].toNumber(), result.point[1].toNumber(), result.point[2].toNumber()]}
              />
            </div>
          )}

          <Steps
            title="Passaggi"
            steps={[
              `Valuto l'equazione in P: numeratore = ${result.num}`,
              `Norma² della normale = ${result.denom}`,
              `Distanza = |${result.num}| / √(${result.denom}) = ${absF(result.num)} / √(${result.denom}) ≈ ${Math.round(result.dist * 1e6) / 1e6}`,
              `Proiezione: H = P − (numeratore / norma²) · normale`,
            ]}
          />
        </>
      )}
    </div>
  );
}
