// Visualizzazione 2D di un cambiamento di riferimento: mostra il riferimento
// "vecchio" (O; i, j) fisso all'origine, il nuovo riferimento (O'; i', j') e un
// punto P con la sua decomposizione P = O' + x'·i' + y'·j'.

type Vec2 = [number, number];

interface Props {
  oPrime: Vec2;
  iPrime: Vec2;
  jPrime: Vec2;
  point: Vec2;
  pNew?: Vec2; // coordinate di P nel nuovo riferimento (per la decomposizione)
  range?: number;
  size?: number;
}

const COL_OLD = "#8a8a9a";
const COL_NEW = "#5b5bd6";
const COL_PT = "#d64545";
const COL_GRID = "#5b5bd6";

export function FramePlane2D({
  oPrime,
  iPrime,
  jPrime,
  point,
  pNew,
  range,
  size = 360,
}: Props) {
  // Se non è fornito un range, lo si calcola per contenere tutti gli elementi
  // (origini, versori e punto P) con un margine.
  const qCorner: Vec2 | null = pNew
    ? [oPrime[0] + pNew[0] * iPrime[0], oPrime[1] + pNew[0] * iPrime[1]]
    : null;
  const keyPoints: Vec2[] = [
    [0, 0],
    oPrime,
    [oPrime[0] + iPrime[0], oPrime[1] + iPrime[1]],
    [oPrime[0] + jPrime[0], oPrime[1] + jPrime[1]],
    point,
    ...(qCorner ? [qCorner] : []),
  ];
  const R =
    range ??
    Math.max(3, Math.ceil(Math.max(...keyPoints.flatMap(([x, y]) => [Math.abs(x), Math.abs(y)]))) + 2);

  const scale = size / (2 * R);
  const sx = (x: number) => size / 2 + x * scale;
  const sy = (y: number) => size / 2 - y * scale;

  // Passo della griglia intera: più rado quando l'area è grande, per non
  // riempire il grafico di linee.
  const step = R <= 12 ? 1 : Math.ceil(R / 10);
  const ticks: number[] = [];
  for (let t = -R; t <= R; t += step) ticks.push(t);

  // Griglia del nuovo riferimento (rette parallele a i' e j' passanti per O').
  const gridN = R + 2;
  const newGrid: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let k = -gridN; k <= gridN; k++) {
    const bx = oPrime[0] + k * jPrime[0];
    const by = oPrime[1] + k * jPrime[1];
    newGrid.push({
      x1: sx(bx - gridN * iPrime[0]),
      y1: sy(by - gridN * iPrime[1]),
      x2: sx(bx + gridN * iPrime[0]),
      y2: sy(by + gridN * iPrime[1]),
    });
    const cx = oPrime[0] + k * iPrime[0];
    const cy = oPrime[1] + k * iPrime[1];
    newGrid.push({
      x1: sx(cx - gridN * jPrime[0]),
      y1: sy(cy - gridN * jPrime[1]),
      x2: sx(cx + gridN * jPrime[0]),
      y2: sy(cy + gridN * jPrime[1]),
    });
  }

  function Arrow({ from, to, color, id, label }: { from: Vec2; to: Vec2; color: string; id: string; label: string }) {
    return (
      <g>
        <line
          x1={sx(from[0])}
          y1={sy(from[1])}
          x2={sx(to[0])}
          y2={sy(to[1])}
          stroke={color}
          strokeWidth={2.5}
          markerEnd={`url(#fp-arrow-${id})`}
        />
        <text x={sx(to[0]) + 6} y={sy(to[1]) - 6} fill={color} fontSize={13} fontWeight={700}>
          {label}
        </text>
      </g>
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
      <defs>
        {["old", "new"].map((id) => (
          <marker key={id} id={`fp-arrow-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={id === "old" ? COL_OLD : COL_NEW} />
          </marker>
        ))}
      </defs>

      {/* griglia intera del vecchio riferimento */}
      {ticks.map((t) => (
        <g key={`g${t}`} stroke="var(--border)" strokeWidth={0.5}>
          <line x1={sx(t)} y1={0} x2={sx(t)} y2={size} />
          <line x1={0} y1={sy(t)} x2={size} y2={sy(t)} />
        </g>
      ))}

      {/* griglia del nuovo riferimento */}
      {newGrid.map((l, i) => (
        <line key={`n${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={COL_GRID} strokeWidth={1} opacity={0.28} />
      ))}

      {/* assi del nuovo riferimento (rette per O' lungo i' e j') */}
      <line
        x1={sx(oPrime[0] - gridN * iPrime[0])} y1={sy(oPrime[1] - gridN * iPrime[1])}
        x2={sx(oPrime[0] + gridN * iPrime[0])} y2={sy(oPrime[1] + gridN * iPrime[1])}
        stroke={COL_NEW} strokeWidth={1.2} opacity={0.6}
      />
      <line
        x1={sx(oPrime[0] - gridN * jPrime[0])} y1={sy(oPrime[1] - gridN * jPrime[1])}
        x2={sx(oPrime[0] + gridN * jPrime[0])} y2={sy(oPrime[1] + gridN * jPrime[1])}
        stroke={COL_NEW} strokeWidth={1.2} opacity={0.6}
      />

      {/* assi del vecchio riferimento */}
      <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke={COL_OLD} strokeWidth={1.4} />
      <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke={COL_OLD} strokeWidth={1.4} />

      {/* base vecchia i, j */}
      <Arrow from={[0, 0]} to={[1, 0]} color={COL_OLD} id="old" label="i" />
      <Arrow from={[0, 0]} to={[0, 1]} color={COL_OLD} id="old" label="j" />
      <text x={sx(0) - 14} y={sy(0) + 16} fill={COL_OLD} fontSize={13} fontWeight={700}>O</text>

      {/* decomposizione P = O' + x'i' + y'j': parallelogramma con entrambe le proiezioni.
          A = proiezione di P sull'asse i' (lungo j'); Bp = proiezione sull'asse j' (lungo i'). */}
      {pNew && (() => {
        const A: Vec2 = [oPrime[0] + pNew[0] * iPrime[0], oPrime[1] + pNew[0] * iPrime[1]];
        const Bp: Vec2 = [oPrime[0] + pNew[1] * jPrime[0], oPrime[1] + pNew[1] * jPrime[1]];
        return (
          <>
            {/* lati lungo gli assi (pieni) */}
            <line x1={sx(oPrime[0])} y1={sy(oPrime[1])} x2={sx(A[0])} y2={sy(A[1])} stroke={COL_PT} strokeWidth={2} />
            <line x1={sx(oPrime[0])} y1={sy(oPrime[1])} x2={sx(Bp[0])} y2={sy(Bp[1])} stroke={COL_PT} strokeWidth={2} />
            {/* proiezioni (tratteggiate): da A e da Bp fino a P */}
            <line x1={sx(A[0])} y1={sy(A[1])} x2={sx(point[0])} y2={sy(point[1])} stroke={COL_PT} strokeWidth={1.4} strokeDasharray="5,4" />
            <line x1={sx(Bp[0])} y1={sy(Bp[1])} x2={sx(point[0])} y2={sy(point[1])} stroke={COL_PT} strokeWidth={1.4} strokeDasharray="5,4" />
            {/* punti proiezione */}
            <circle cx={sx(A[0])} cy={sy(A[1])} r={3} fill={COL_PT} />
            <text x={sx(A[0]) + 5} y={sy(A[1]) + 14} fill={COL_PT} fontSize={12} fontWeight={700}>x'·i'</text>
            <circle cx={sx(Bp[0])} cy={sy(Bp[1])} r={3} fill={COL_PT} />
            <text x={sx(Bp[0]) + 5} y={sy(Bp[1]) + 14} fill={COL_PT} fontSize={12} fontWeight={700}>y'·j'</text>
          </>
        );
      })()}

      {/* nuova base i', j' */}
      <Arrow from={oPrime} to={[oPrime[0] + iPrime[0], oPrime[1] + iPrime[1]]} color={COL_NEW} id="new" label="i'" />
      <Arrow from={oPrime} to={[oPrime[0] + jPrime[0], oPrime[1] + jPrime[1]]} color={COL_NEW} id="new" label="j'" />

      {/* O' */}
      <circle cx={sx(oPrime[0])} cy={sy(oPrime[1])} r={3.5} fill={COL_NEW} />
      <text x={sx(oPrime[0]) - 16} y={sy(oPrime[1]) + 16} fill={COL_NEW} fontSize={13} fontWeight={700}>O'</text>

      {/* P */}
      <circle cx={sx(point[0])} cy={sy(point[1])} r={4} fill={COL_PT} />
      <text x={sx(point[0]) + 8} y={sy(point[1]) - 8} fill={COL_PT} fontSize={14} fontWeight={700}>P</text>
    </svg>
  );
}
