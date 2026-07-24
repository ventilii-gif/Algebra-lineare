import { useState } from "react";

// Grafico 3D (assonometrico): retta passante per A e B, punto P0, proiezione H
// di P0 sulla retta e segmento della distanza. Manopola per ruotare.

type Vec3 = [number, number, number];

interface Props {
  A: Vec3;
  B: Vec3;
  P0: Vec3;
  size?: number;
}

const COL_AX = "#8a8a9a";
const COL_LINE = "#5b5bd6";
const COL_PT = "#d64545";
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

export function LineProjectionPlot3D({ A, B, P0, size = 400 }: Props) {
  const [azimuth, setAzimuth] = useState(25);

  const v: Vec3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
  const vv = v[0] * v[0] + v[1] * v[1] + v[2] * v[2] || 1;
  const ap0: Vec3 = [P0[0] - A[0], P0[1] - A[1], P0[2] - A[2]];
  const t = (ap0[0] * v[0] + ap0[1] * v[1] + ap0[2] * v[2]) / vv;
  const H: Vec3 = [A[0] + t * v[0], A[1] + t * v[1], A[2] + t * v[2]];
  const dist = Math.hypot(P0[0] - H[0], P0[1] - H[1], P0[2] - H[2]);
  const vlen = Math.sqrt(vv);
  const dir: Vec3 = [v[0] / vlen, v[1] / vlen, v[2] / vlen];

  const keyAbs = Math.max(...[A, B, P0, H].flatMap((p) => p.map(Math.abs)), 3);
  const R = Math.ceil(keyAbs) + 1;
  const scale = size / (2.4 * R);
  const cx = size / 2;
  const cy = size / 2 + R * scale * 0.3;

  const az = (azimuth * Math.PI) / 180;
  const ca = Math.cos(az);
  const sa = Math.sin(az);
  function project([x, y, z]: Vec3): [number, number] {
    const rx = x * ca - y * sa;
    const ry = x * sa + y * ca;
    return [cx + (rx - ry) * COS30 * scale, cy + ((rx + ry) * SIN30 - z) * scale];
  }

  const L = R * 2;
  const l1 = project([H[0] - dir[0] * L, H[1] - dir[1] * L, H[2] - dir[2] * L]);
  const l2 = project([H[0] + dir[0] * L, H[1] + dir[1] * L, H[2] + dir[2] * L]);

  const O = project([0, 0, 0]);
  const axes: { to: Vec3; label: string }[] = [
    { to: [R, 0, 0], label: "X" },
    { to: [0, R, 0], label: "Y" },
    { to: [0, 0, R], label: "Z" },
  ];
  const Ap = project(A);
  const Bp = project(B);
  const Pp = project(P0);
  const Hp = project(H);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
        {axes.map((ax) => {
          const to = project(ax.to);
          return (
            <g key={ax.label}>
              <line x1={O[0]} y1={O[1]} x2={to[0]} y2={to[1]} stroke={COL_AX} strokeWidth={1.2} opacity={0.7} />
              <text x={to[0] + 4} y={to[1] - 4} fill={COL_AX} fontSize={12} fontWeight={700}>{ax.label}</text>
            </g>
          );
        })}

        {/* retta AB */}
        <line x1={l1[0]} y1={l1[1]} x2={l2[0]} y2={l2[1]} stroke={COL_LINE} strokeWidth={2.2} />

        {/* distanza P0-H */}
        <line x1={Pp[0]} y1={Pp[1]} x2={Hp[0]} y2={Hp[1]} stroke={COL_PT} strokeWidth={1.6} strokeDasharray="5,4" />
        <text x={(Pp[0] + Hp[0]) / 2 + 6} y={(Pp[1] + Hp[1]) / 2} fill={COL_PT} fontSize={12} fontWeight={700}>d = {Math.round(dist * 1000) / 1000}</text>

        {/* punti A, B */}
        <circle cx={Ap[0]} cy={Ap[1]} r={3.5} fill={COL_LINE} />
        <text x={Ap[0] + 6} y={Ap[1] - 6} fill={COL_LINE} fontSize={13} fontWeight={700}>A</text>
        <circle cx={Bp[0]} cy={Bp[1]} r={3.5} fill={COL_LINE} />
        <text x={Bp[0] + 6} y={Bp[1] - 6} fill={COL_LINE} fontSize={13} fontWeight={700}>B</text>

        {/* H e P0 */}
        <circle cx={Hp[0]} cy={Hp[1]} r={3.5} fill={COL_LINE} />
        <text x={Hp[0] + 6} y={Hp[1] + 14} fill={COL_LINE} fontSize={13} fontWeight={700}>H</text>
        <circle cx={Pp[0]} cy={Pp[1]} r={4} fill={COL_PT} />
        <text x={Pp[0] + 7} y={Pp[1] - 7} fill={COL_PT} fontSize={14} fontWeight={700}>P₀</text>
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "center", marginTop: "0.4rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ruota vista</span>
        <input type="range" min={-180} max={180} value={azimuth} onChange={(e) => setAzimuth(Number(e.target.value))} style={{ width: "60%" }} />
      </div>
    </div>
  );
}
