// Grafico 2D: retta r: ax+by+c=0, punto P, piede della perpendicolare H
// (proiezione) e segmento della distanza.

type Vec2 = [number, number];

interface Props {
  a: number;
  b: number;
  c: number;
  point: Vec2;
  size?: number;
}

const COL_AX = "#8a8a9a";
const COL_LINE = "#5b5bd6";
const COL_PT = "#d64545";

export function LineProjectionPlot({ a, b, c, point, size = 340 }: Props) {
  const [x0, y0] = point;
  const denom = a * a + b * b || 1;
  const s = (a * x0 + b * y0 + c) / denom;
  const H: Vec2 = [x0 - s * a, y0 - s * b];
  const dist = Math.abs(a * x0 + b * y0 + c) / Math.sqrt(denom);

  const pts: Vec2[] = [[0, 0], point, H];
  const R = Math.max(3, Math.ceil(Math.max(...pts.flatMap(([x, y]) => [Math.abs(x), Math.abs(y)]))) + 1);
  const scale = size / (2 * R);
  const sx = (x: number) => size / 2 + x * scale;
  const sy = (y: number) => size / 2 - y * scale;

  const vn = Math.hypot(-b, a) || 1;
  const dir: Vec2 = [-b / vn, a / vn];
  const L = R * 2;
  const p1: Vec2 = [H[0] - dir[0] * L, H[1] - dir[1] * L];
  const p2: Vec2 = [H[0] + dir[0] * L, H[1] + dir[1] * L];

  const ticks = Array.from({ length: 2 * R + 1 }, (_, i) => i - R);
  const mid: Vec2 = [(point[0] + H[0]) / 2, (point[1] + H[1]) / 2];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8, maxWidth: "100%" }}>
      {ticks.map((t) => (
        <g key={t} stroke="var(--border)" strokeWidth={0.5}>
          <line x1={sx(t)} y1={0} x2={sx(t)} y2={size} />
          <line x1={0} y1={sy(t)} x2={size} y2={sy(t)} />
        </g>
      ))}
      <line x1={0} y1={sy(0)} x2={size} y2={sy(0)} stroke={COL_AX} strokeWidth={1.2} />
      <line x1={sx(0)} y1={0} x2={sx(0)} y2={size} stroke={COL_AX} strokeWidth={1.2} />

      {/* retta */}
      <line x1={sx(p1[0])} y1={sy(p1[1])} x2={sx(p2[0])} y2={sy(p2[1])} stroke={COL_LINE} strokeWidth={2.4} />
      <text x={sx(p2[0]) - 16} y={sy(p2[1]) - 6} fill={COL_LINE} fontSize={13} fontWeight={700}>r</text>

      {/* distanza P-H */}
      <line x1={sx(point[0])} y1={sy(point[1])} x2={sx(H[0])} y2={sy(H[1])} stroke={COL_PT} strokeWidth={1.6} strokeDasharray="5,4" />
      <text x={sx(mid[0]) + 6} y={sy(mid[1])} fill={COL_PT} fontSize={12} fontWeight={700}>d = {Math.round(dist * 1000) / 1000}</text>

      {/* punti */}
      <circle cx={sx(point[0])} cy={sy(point[1])} r={4} fill={COL_PT} />
      <text x={sx(point[0]) + 8} y={sy(point[1]) - 8} fill={COL_PT} fontSize={14} fontWeight={700}>P</text>
      <circle cx={sx(H[0])} cy={sy(H[1])} r={3.5} fill={COL_LINE} />
      <text x={sx(H[0]) + 8} y={sy(H[1]) + 14} fill={COL_LINE} fontSize={13} fontWeight={700}>H</text>
    </svg>
  );
}
