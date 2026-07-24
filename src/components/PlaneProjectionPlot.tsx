import { useState } from "react";

// Grafico 3D (assonometrico) della proiezione di un punto P su un piano
// π: ax+by+cz+d=0. Mostra il piano (come toppa), la normale n in H, il piede
// H (proiezione) e il segmento della distanza P–H.

type Vec3 = [number, number, number];

interface Props {
  a: number;
  b: number;
  c: number;
  d: number;
  point: Vec3;
  size?: number;
}

const COL_AX = "#8a8a9a";
const COL_PLANE = "#5b5bd6";
const COL_PT = "#d64545";
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

const cross = (u: Vec3, v: Vec3): Vec3 => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];
const norm = (u: Vec3) => Math.hypot(u[0], u[1], u[2]) || 1;
const unit = (u: Vec3): Vec3 => [u[0] / norm(u), u[1] / norm(u), u[2] / norm(u)];

export function PlaneProjectionPlot({ a, b, c, d, point, size = 400 }: Props) {
  const [azimuth, setAzimuth] = useState(25);

  const n: Vec3 = [a, b, c];
  const denom = a * a + b * b + c * c || 1;
  const s = (a * point[0] + b * point[1] + c * point[2] + d) / denom;
  const H: Vec3 = [point[0] - s * n[0], point[1] - s * n[1], point[2] - s * n[2]];
  const dist = Math.abs(s) * Math.sqrt(denom);

  // base nel piano
  const ref: Vec3 = Math.abs(a) <= Math.abs(b) && Math.abs(a) <= Math.abs(c) ? [1, 0, 0] : Math.abs(b) <= Math.abs(c) ? [0, 1, 0] : [0, 0, 1];
  const u = unit(cross(n, ref));
  const w = unit(cross(n, u));

  const keyAbs = Math.max(...[point, H].flatMap((p) => p.map(Math.abs)), 3);
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

  const hs = Math.max(2, R * 0.7);
  const patch: Vec3[] = [
    [H[0] - hs * u[0] - hs * w[0], H[1] - hs * u[1] - hs * w[1], H[2] - hs * u[2] - hs * w[2]],
    [H[0] + hs * u[0] - hs * w[0], H[1] + hs * u[1] - hs * w[1], H[2] + hs * u[2] - hs * w[2]],
    [H[0] + hs * u[0] + hs * w[0], H[1] + hs * u[1] + hs * w[1], H[2] + hs * u[2] + hs * w[2]],
    [H[0] - hs * u[0] + hs * w[0], H[1] - hs * u[1] + hs * w[1], H[2] - hs * u[2] + hs * w[2]],
  ];
  const patchPts = patch.map(project).map((p) => `${p[0]},${p[1]}`).join(" ");

  const nUnit = unit(n);
  const nEnd: Vec3 = [H[0] + nUnit[0] * (R * 0.8), H[1] + nUnit[1] * (R * 0.8), H[2] + nUnit[2] * (R * 0.8)];

  const O = project([0, 0, 0]);
  const axes: { to: Vec3; label: string }[] = [
    { to: [R, 0, 0], label: "X" },
    { to: [0, R, 0], label: "Y" },
    { to: [0, 0, R], label: "Z" },
  ];
  const Pp = project(point);
  const Hp = project(H);
  const Np = project(nEnd);

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
        <defs>
          <marker id="pp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COL_PLANE} />
          </marker>
        </defs>

        {/* assi di riferimento */}
        {axes.map((ax) => {
          const to = project(ax.to);
          return (
            <g key={ax.label}>
              <line x1={O[0]} y1={O[1]} x2={to[0]} y2={to[1]} stroke={COL_AX} strokeWidth={1.2} opacity={0.7} />
              <text x={to[0] + 4} y={to[1] - 4} fill={COL_AX} fontSize={12} fontWeight={700}>{ax.label}</text>
            </g>
          );
        })}

        {/* piano */}
        <polygon points={patchPts} fill={COL_PLANE} fillOpacity={0.14} stroke={COL_PLANE} strokeWidth={1.3} />
        <text x={project(patch[2])[0]} y={project(patch[2])[1]} fill={COL_PLANE} fontSize={12} fontWeight={700}>π</text>

        {/* normale in H */}
        <line x1={Hp[0]} y1={Hp[1]} x2={Np[0]} y2={Np[1]} stroke={COL_PLANE} strokeWidth={2} markerEnd="url(#pp-arrow)" />
        <text x={Np[0] + 5} y={Np[1] - 5} fill={COL_PLANE} fontSize={12} fontWeight={700}>n</text>

        {/* distanza P-H */}
        <line x1={Pp[0]} y1={Pp[1]} x2={Hp[0]} y2={Hp[1]} stroke={COL_PT} strokeWidth={1.6} strokeDasharray="5,4" />
        <text x={(Pp[0] + Hp[0]) / 2 + 6} y={(Pp[1] + Hp[1]) / 2} fill={COL_PT} fontSize={12} fontWeight={700}>d = {Math.round(dist * 1000) / 1000}</text>

        {/* punti */}
        <circle cx={Pp[0]} cy={Pp[1]} r={4} fill={COL_PT} />
        <text x={Pp[0] + 7} y={Pp[1] - 7} fill={COL_PT} fontSize={14} fontWeight={700}>P</text>
        <circle cx={Hp[0]} cy={Hp[1]} r={3.5} fill={COL_PLANE} />
        <text x={Hp[0] + 7} y={Hp[1] + 14} fill={COL_PLANE} fontSize={13} fontWeight={700}>H</text>
      </svg>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", justifyContent: "center", marginTop: "0.4rem" }}>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Ruota vista</span>
        <input type="range" min={-180} max={180} value={azimuth} onChange={(e) => setAzimuth(Number(e.target.value))} style={{ width: "60%" }} />
      </div>
    </div>
  );
}
