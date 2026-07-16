import { useMemo, useState } from "react";
import { MatrixInput } from "../../components/MatrixInput";
import { determinantWithSteps, parseMatrix } from "../../lib/matrix";
import { Steps } from "../../components/Steps";

export function DeterminanteTool() {
  const [size, setSize] = useState(3);
  const [str, setStr] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const result = useMemo(() => {
    setError(null);
    try {
      const A = parseMatrix(str);
      return determinantWithSteps(A);
    } catch (e) {
      setError((e as Error).message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [str]);

  return (
    <div>
      <p style={{ fontWeight: 600 }}>Ordine della matrice</p>
      <div className="btn-row">
        {[2, 3, 4, 5].map((n) => (
          <button key={n} className={`tab-btn ${size === n ? "active" : ""}`} onClick={() => setSize(n)}>
            {n}×{n}
          </button>
        ))}
      </div>
      <MatrixInput rows={size} cols={size} onChange={setStr} />

      {error && <div className="result-box error">{error}</div>}
      {result && (
        <>
          <div className="result-box">
            <p style={{ fontWeight: 600 }}>det(A) = {result.value.toString()}</p>
          </div>
          <Steps steps={result.steps} />
        </>
      )}
    </div>
  );
}
