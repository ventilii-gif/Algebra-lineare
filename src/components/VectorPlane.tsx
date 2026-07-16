interface VecSpec {
  x: number;
  y: number;
  color: string;
  label: string;
  dashed?: boolean;
}

interface Props {
  vectors: VecSpec[];
  range?: number;
  size?: number;
  gridLines?: { from: [number, number]; to: [number, number]; color?: string }[];
}

const toScreen = (x: number, y: number, range: number, size: number) => {
  const scale = size / (2 * range);
  return { sx: size / 2 + x * scale, sy: size / 2 - y * scale };
};

export function VectorPlane({ vectors, range = 6, size = 380, gridLines = [] }: Props) {
  const origin = toScreen(0, 0, range, size);
  const ticks = Array.from({ length: 2 * range + 1 }, (_, i) => i - range);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: "var(--code-bg)", borderRadius: 8 }}>
      <defs>
        {vectors.map((v, i) => (
          <marker
            key={i}
            id={`arrow-${i}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={v.color} />
          </marker>
        ))}
      </defs>

      {ticks.map((t) => {
        const p1 = toScreen(t, -range, range, size);
        const p2 = toScreen(t, range, range, size);
        const q1 = toScreen(-range, t, range, size);
        const q2 = toScreen(range, t, range, size);
        return (
          <g key={t} stroke="var(--border)" strokeWidth={0.5}>
            <line x1={p1.sx} y1={p1.sy} x2={p2.sx} y2={p2.sy} />
            <line x1={q1.sx} y1={q1.sy} x2={q2.sx} y2={q2.sy} />
          </g>
        );
      })}

      {gridLines.map((g, i) => {
        const p1 = toScreen(g.from[0], g.from[1], range, size);
        const p2 = toScreen(g.to[0], g.to[1], range, size);
        return (
          <line
            key={i}
            x1={p1.sx}
            y1={p1.sy}
            x2={p2.sx}
            y2={p2.sy}
            stroke={g.color ?? "var(--accent)"}
            strokeWidth={1}
            opacity={0.35}
          />
        );
      })}

      <line x1={0} y1={origin.sy} x2={size} y2={origin.sy} stroke="var(--text-muted)" strokeWidth={1} />
      <line x1={origin.sx} y1={0} x2={origin.sx} y2={size} stroke="var(--text-muted)" strokeWidth={1} />

      {vectors.map((v, i) => {
        const p = toScreen(v.x, v.y, range, size);
        return (
          <g key={i}>
            <line
              x1={origin.sx}
              y1={origin.sy}
              x2={p.sx}
              y2={p.sy}
              stroke={v.color}
              strokeWidth={2.5}
              strokeDasharray={v.dashed ? "5,4" : undefined}
              markerEnd={`url(#arrow-${i})`}
            />
            <text x={p.sx + 6} y={p.sy - 6} fill={v.color} fontSize={13} fontWeight={600}>
              {v.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
