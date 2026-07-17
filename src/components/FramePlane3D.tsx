import { useState } from "react";

// Visualizzazione 3D (proiezione assonometrica) di un cambiamento di
// riferimento: vecchio riferimento (O; assi X, Y, Z), nuovo riferimento
// (O'; i', j', k') e il punto P con la sua decomposizione
// P = O' + x'·i' + y'·j' + z'·k'. Una manopola ruota la vista.

type Vec3 = [number, number, number];

interface Props {
  oPrime: Vec3;
  iPrime: Vec3;
  jPrime: Vec3;
  kPrime: Vec3;
  point: Vec3;
  pNew?: Vec3;
  pointLabel?: string;
  range?: number;
  size?: number;
}

const COL_OLD = "#8a8a9a";
const COL_NEW = "#5b5bd6";
const COL_PT = "#d64545";
const COL_GRID = "#8a8a9a";

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

export function FramePlane3D({
  oPrime,
  iPrime,
  jPrime,
  kPrime,
  point,
  pNew,
  pointLabel = "P",
  range,
  size = 400,
}: Props) {
  const [azimuth, setAzimuth] = useState(20);

  // Range calcolato per contenere tutti gli elementi, se non fornito.
  const keyPoints: Vec3[] = [
    [0, 0, 0],
    oPrime,
    [oPrime[0] + iPrime[0], oPrime[1] + iPrime[1], oPrime[2] + iPrime[2]],
    [oPrime[0] + jPrime[0], oPrime[1] + jPrime[1], oPrime[2] + jPrime[2]],
    [oPrime[0] + kPrime[0], oPrime[1] + kPrime[1], oPrime[2] + kPrime[2]],
    point,
  ];
  const R =
    range ??
    Math.max(3, Math.ceil(Math.max(...keyPoints.flatMap((p) => p.map(Math.abs)))) + 2);

  const scale = size / (2.4 * R);
  const cx = size / 2;
  const cy = size / 2 + R * scale * 0.35;

  const a = (azimuth * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);

  function project([x, y, z]: Vec3): [number, number] {
    // rotazione attorno all'asse verticale (z) + proiezione isometrica
    const rx = x * ca - y * sa;
    const ry = x * sa + y * ca;
    const isoX = (rx - ry) * COS30;
    const isoY = (rx + ry) * SIN30 - z;
    return [cx + isoX * scale, cy + isoY * scale];
  }

  const add = (p: Vec3, q: Vec3, s = 1): Vec3 => [p[0] + q[0] * s, p[1] + q[1] * s, p[2] + q[2] * s];

  // griglia sul piano z = 0 (passo più rado se l'area è grande)
  const step = R <= 12 ? 1 : Math.ceil(R / 10);
  const gridLines: [number, number][][] = [];
  for (let t = -R; t <= R; t += step) {
    gridLines.push([project([t, -R, 0]), project([t, R, 0])]);
    gridLines.push([project([-R, t, 0]), project([R, t, 0])]);
  }

  const axes: { to: Vec3; label: string }[] = [
    { to: [R, 0, 0], label: "X" },
    { to: [0, R, 0], label: "Y" },
    { to: [0, 0, R], label: "Z" },
  ];

  const O = project([0, 0, 0]);
  const Op = project(oPrime);
  const Pp = project(point);

  // decomposizione: parallelepipedo con O' e P come vertici opposti e spigoli
  // paralleli a x'·i', y'·j', z'·k' (mostra tutte le proiezioni).
  let box: { from: [number, number]; to: [number, number]; solid: boolean }[] = [];
  if (pNew) {
    const a: Vec3 = [iPrime[0] * pNew[0], iPrime[1] * pNew[0], iPrime[2] * pNew[0]];
    const b: Vec3 = [jPrime[0] * pNew[1], jPrime[1] * pNew[1], jPrime[2] * pNew[1]];
    const c: Vec3 = [kPrime[0] * pNew[2], kPrime[1] * pNew[2], kPrime[2] * pNew[2]];
    const V = (i: number, j: number, k: number): Vec3 => [
      oPrime[0] + i * a[0] + j * b[0] + k * c[0],
      oPrime[1] + i * a[1] + j * b[1] + k * c[1],
      oPrime[2] + i * a[2] + j * b[2] + k * c[2],
    ];
    const edges: [number[], number[], boolean][] = [
      [[0, 0, 0], [1, 0, 0], true], [[0, 0, 0], [0, 1, 0], true], [[0, 0, 0], [0, 0, 1], true],
      [[1, 0, 0], [1, 1, 0], false], [[1, 0, 0], [1, 0, 1], false],
      [[0, 1, 0], [1, 1, 0], false], [[0, 1, 0], [0, 1, 1], false],
      [[0, 0, 1], [1, 0, 1], false], [[0, 0, 1], [0, 1, 1], false],
      [[1, 1, 0], [1, 1, 1], false], [[1, 0, 1], [1, 1, 1], false], [[0, 1, 1], [1, 1, 1], false],
    ];
    box = edges.map(([u, w, solid]) => ({
      from: project(V(u[0], u[1], u[2])),
      to: project(V(w[0], w[1], w[2])),
      solid,
    }));
  }

  function Arrow({ from, to, color, id, label }: { from: [number, number]; to: [number, number]; color: string; id: string; label: string }) {
    return (
      <g>
        <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={2.4} markerEnd={`url(#f3-${id})`} />
        <text x={to[0] + 5} y={to[1] - 5} fill={color} fontSize={13} fontWeight={700}>{label}</text>
      </g>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
        <defs>
          {[["old", COL_OLD], ["new", COL_NEW]].map(([id, col]) => (
            <marker key={id} id={`f3-${id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={col} />
            </marker>
          ))}
        </defs>

        {/* griglia z=0 */}
        {gridLines.map((l, i) => (
          <line key={i} x1={l[0][0]} y1={l[0][1]} x2={l[1][0]} y2={l[1][1]} stroke={COL_GRID} strokeWidth={0.5} opacity={0.3} />
        ))}

        {/* assi vecchio riferimento */}
        {axes.map((ax) => {
          const to = project(ax.to);
          return <Arrow key={ax.label} from={O} to={to} color={COL_OLD} id="old" label={ax.label} />;
        })}
        <text x={O[0] - 14} y={O[1] + 14} fill={COL_OLD} fontSize={13} fontWeight={700}>O</text>

        {/* decomposizione: parallelepipedo (spigoli pieni da O', il resto tratteggiato) */}
        {box.map((e, i) => (
          <line
            key={i}
            x1={e.from[0]}
            y1={e.from[1]}
            x2={e.to[0]}
            y2={e.to[1]}
            stroke={COL_PT}
            strokeWidth={e.solid ? 2 : 1.3}
            strokeDasharray={e.solid ? undefined : "5,4"}
            opacity={e.solid ? 1 : 0.8}
          />
        ))}

        {/* nuova base */}
        <Arrow from={Op} to={project(add(oPrime, iPrime))} color={COL_NEW} id="new" label="i'" />
        <Arrow from={Op} to={project(add(oPrime, jPrime))} color={COL_NEW} id="new" label="j'" />
        <Arrow from={Op} to={project(add(oPrime, kPrime))} color={COL_NEW} id="new" label="k'" />

        {/* O' e P */}
        <circle cx={Op[0]} cy={Op[1]} r={3.5} fill={COL_NEW} />
        <text x={Op[0] - 16} y={Op[1] + 14} fill={COL_NEW} fontSize={13} fontWeight={700}>O'</text>
        <circle cx={Pp[0]} cy={Pp[1]} r={4} fill={COL_PT} />
        <text x={Pp[0] + 7} y={Pp[1] - 7} fill={COL_PT} fontSize={14} fontWeight={700}>{pointLabel}</text>
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "center", marginTop: "0.4rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ruota vista</span>
        <input type="range" min={-180} max={180} value={azimuth} onChange={(e) => setAzimuth(Number(e.target.value))} style={{ width: "60%" }} />
      </div>
    </div>
  );
}
