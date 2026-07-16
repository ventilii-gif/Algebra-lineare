import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { Steps } from "../../components/Steps";
import { complexToString, eigenvalues2x2, eigenvalues3x3, eigenvectorFor } from "../../lib/eigen";

export function AutovaloriTool() {
  const [size, setSize] = useState<2 | 3>(2);
  const [str, setStr] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const nums = str.map((row) => row.map((c) => {
        const v = parseFloat(c.replace(",", "."));
        if (Number.isNaN(v)) throw new Error(`Valore non numerico: "${c}"`);
        return v;
      }));
      if (nums.length !== size || nums.some((r) => r.length !== size)) return null;
      const eig = size === 2 ? eigenvalues2x2(nums) : eigenvalues3x3(nums);
      const vectors = eig.eigenvalues.map((l) =>
        Math.abs(l.im) < 1e-7 ? eigenvectorFor(nums, l.re) : null
      );
      return { eig, vectors, nums };
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str, size]);

  return (
    <div>
      <p style={{ fontWeight: 600 }}>Ordine della matrice</p>
      <div className="btn-row">
        {[2, 3].map((n) => (
          <button key={n} className={`tab-btn ${size === n ? "active" : ""}`} onClick={() => setSize(n as 2 | 3)}>
            {n}×{n}
          </button>
        ))}
      </div>
      <MatrixInput rows={size} cols={size} onChange={setStr} />
      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
        Il calcolo è numerico (virgola mobile): gli autovalori possono essere irrazionali o
        complessi.
      </p>

      {error && <div className="result-box error">{error}</div>}
      {result && (
        <>
          <div className="result-box">
            <p style={{ fontWeight: 600, marginBottom: "0.4rem" }}>Autovalori</p>
            {result.eig.eigenvalues.map((l, i) => (
              <p key={i} className="mono">
                λ{i + 1} = {complexToString(l)}
                {result.vectors[i] && (
                  <span> — autovettore: ({result.vectors[i]!.join(", ")})</span>
                )}
                {!result.vectors[i] && Math.abs(l.im) > 1e-7 && (
                  <span style={{ color: "var(--text-muted)" }}> (autovalore complesso, autovettore non mostrato)</span>
                )}
              </p>
            ))}
          </div>
          <Steps steps={result.eig.charPolySteps} title="Polinomio caratteristico" />
        </>
      )}
    </div>
  );
}
