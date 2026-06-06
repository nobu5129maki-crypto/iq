import type { SpatialShape, SpatialVisual } from '../types';

interface Props {
  visual: SpatialVisual;
  compact?: boolean;
}

function ShapeIcon({ shape, mirrored }: { shape: SpatialShape; mirrored?: boolean }) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const size = sizeMap[shape.size];
  const fill = shape.filled ? '#2563eb' : 'none';
  const stroke = '#2563eb';
  const cx = size / 2;
  const cy = size / 2;

  const transform = `rotate(${shape.rotation} ${cx} ${cy})${
    mirrored ? ` scale(-1, 1) translate(-${size}, 0)` : ''
  }`;

  switch (shape.type) {
    case 'circle':
      return (
        <circle
          cx={cx}
          cy={cy}
          r={size / 2 - 4}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          transform={transform}
        />
      );
    case 'square':
      return (
        <rect
          x={4}
          y={4}
          width={size - 8}
          height={size - 8}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          transform={transform}
        />
      );
    case 'triangle':
      return (
        <polygon
          points={`${cx},4 ${size - 4},${size - 4} 4,${size - 4}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          transform={transform}
        />
      );
    case 'diamond':
      return (
        <polygon
          points={`${cx},4 ${size - 4},${cy} ${cx},${size - 4} 4,${cy}`}
          fill={fill}
          stroke={stroke}
          strokeWidth={2}
          transform={transform}
        />
      );
    case 'lshape': {
      const pad = 4;
      const inner = size - pad * 2;
      const cell = inner / 2;
      const blocks: [number, number][] = [
        [0, 0],
        [0, 1],
        [1, 1],
      ];
      return (
        <g transform={transform}>
          {blocks.map(([col, row], i) => (
            <rect
              key={i}
              x={pad + col * cell + 1}
              y={pad + row * cell + 1}
              width={cell - 2}
              height={cell - 2}
              rx={2}
              fill={fill}
              stroke={stroke}
              strokeWidth={2}
            />
          ))}
        </g>
      );
    }
  }
}

function ShapeSvg({ shape, mirrored }: { shape: SpatialShape; mirrored?: boolean }) {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const size = sizeMap[shape.size];
  return (
    <svg width={size} height={size} className="drop-shadow-sm flex-shrink-0">
      <ShapeIcon shape={shape} mirrored={mirrored} />
    </svg>
  );
}

function CubeNetDiagram({
  highlightFaces,
  compact,
}: {
  highlightFaces?: number[];
  compact?: boolean;
}) {
  const cell = 44;
  const faces: { num: number; x: number; y: number }[] = [
    { num: 1, x: 1, y: 0 },
    { num: 4, x: 0, y: 1 },
    { num: 2, x: 1, y: 1 },
    { num: 5, x: 2, y: 1 },
    { num: 6, x: 3, y: 1 },
    { num: 3, x: 1, y: 2 },
  ];

  return (
    <div className={`flex justify-center ${compact ? 'my-2' : 'my-6'}`}>
      <svg width={cell * 4 + 8} height={cell * 3 + 8} className="drop-shadow-sm">
        {faces.map(({ num, x, y }) => {
          const highlighted = highlightFaces?.includes(num);
          return (
            <g key={num}>
            <rect
              x={4 + x * cell}
              y={4 + y * cell}
              width={cell}
              height={cell}
              fill={highlighted ? '#d1fae5' : '#eff6ff'}
              stroke={highlighted ? '#059669' : '#2563eb'}
              strokeWidth={highlighted ? 3 : 2}
              rx={4}
            />
            <text
              x={4 + x * cell + cell / 2}
              y={4 + y * cell + cell / 2 + 6}
              textAnchor="middle"
              className="fill-blue-700 text-xl font-bold"
              style={{ fontSize: 20 }}
            >
              {num}
            </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TetrahedronDiagram({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex justify-center ${compact ? 'my-2' : 'my-6'}`}>
      <svg width={120} height={110} className="drop-shadow-sm">
        <polygon
          points="60,10 110,90 10,90"
          fill="#eff6ff"
          stroke="#2563eb"
          strokeWidth={2}
        />
        <line x1="60" y1="10" x2="60" y2="90" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4" />
        <line x1="35" y1="50" x2="85" y2="50" stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4" />
        <circle cx="60" cy="55" r="3" fill="#2563eb" />
        <text x="60" y="108" textAnchor="middle" className="fill-slate-500 text-xs" style={{ fontSize: 11 }}>
          正四面体（4つの面）
        </text>
      </svg>
    </div>
  );
}

function OrthographicDiagram({ compact }: { compact?: boolean }) {
  const views = [
    { label: '正面', x: 10 },
    { label: '上面', x: 70 },
    { label: '側面', x: 130 },
  ];

  return (
    <div className={`flex justify-center ${compact ? 'my-2' : 'my-6'}`}>
      <svg width={190} height={90} className="drop-shadow-sm">
        {views.map(({ label, x }) => (
          <g key={label}>
            <rect x={x} y={10} width={48} height={48} fill="#eff6ff" stroke="#2563eb" strokeWidth={2} rx={2} />
            <text x={x + 24} y={75} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 12 }}>
              {label}
            </text>
          </g>
        ))}
        <text x={95} y={88} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 10 }}>
          すべて正方形に見える
        </text>
      </svg>
    </div>
  );
}

function FoldCutDiagram({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex justify-center items-center gap-8 ${compact ? 'my-2' : 'my-6'}`}>
      <div className="text-center">
        <svg width={100} height={80} className="drop-shadow-sm mx-auto">
          <rect x={10} y={10} width={80} height={60} fill="#fef3c7" stroke="#d97706" strokeWidth={2} rx={2} />
          <line x1={50} y1={10} x2={50} y2={70} stroke="#ef4444" strokeWidth={2} strokeDasharray="5" />
          <line x1={30} y1={10} x2={70} y2={70} stroke="#2563eb" strokeWidth={2} />
          <text x={50} y={78} textAnchor="middle" style={{ fontSize: 10 }} className="fill-slate-500">
            折って切る
          </text>
        </svg>
      </div>
      <span className="text-slate-400">→</span>
      <div className="text-center">
        <svg width={80} height={80} className="drop-shadow-sm mx-auto">
          <polygon
            points="40,15 65,40 40,65 15,40"
            fill="#eff6ff"
            stroke="#2563eb"
            strokeWidth={2}
          />
          <line x1={15} y1={40} x2={65} y2={40} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3" />
          <text x={40} y={78} textAnchor="middle" style={{ fontSize: 10 }} className="fill-slate-500">
            開いた形
          </text>
        </svg>
      </div>
    </div>
  );
}

function CubeDiagram({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex justify-center ${compact ? 'my-2' : 'my-4'}`}>
      <svg width={80} height={90} className="drop-shadow-sm">
        <polygon points="40,20 70,40 40,60 10,40" fill="#eff6ff" stroke="#2563eb" strokeWidth={2} />
        <polygon points="40,20 70,40 70,70 40,90" fill="#dbeafe" stroke="#2563eb" strokeWidth={2} />
        <polygon points="10,40 40,60 40,90 10,70" fill="#bfdbfe" stroke="#2563eb" strokeWidth={2} />
        <line x1="40" y1="20" x2="40" y2="60" stroke="#2563eb" strokeWidth={1} />
        <line x1="70" y1="40" x2="70" y2="70" stroke="#2563eb" strokeWidth={1} />
        <line x1="10" y1="40" x2="10" y2="70" stroke="#2563eb" strokeWidth={1} />
        <text x="40" y="105" textAnchor="middle" style={{ fontSize: 11 }} className="fill-slate-500">
          立方体
        </text>
      </svg>
    </div>
  );
}

export function SpatialDisplay({ visual, compact = false }: Props) {
  const { questionShape, displayMode = 'single', shapes, highlightFaces } = visual;
  const margin = compact ? 'my-2' : 'my-6';

  if (displayMode === 'cubeNet') {
    return <CubeNetDiagram highlightFaces={highlightFaces} compact={compact} />;
  }
  if (displayMode === 'tetrahedron') return <TetrahedronDiagram compact={compact} />;
  if (displayMode === 'orthographic') return <OrthographicDiagram compact={compact} />;
  if (displayMode === 'foldCut') return <FoldCutDiagram compact={compact} />;
  if (displayMode === 'cube') return <CubeDiagram compact={compact} />;

  if (!questionShape) return null;

  if (displayMode === 'mirror') {
    return (
      <div className={`flex justify-center items-center gap-6 ${margin}`}>
        <div className="text-center">
          <ShapeSvg shape={questionShape} />
          <p className="text-xs text-slate-500 mt-2">もとの形</p>
        </div>
        <span className="text-slate-400 text-lg">→</span>
        <div className="text-center">
          <ShapeSvg shape={questionShape} mirrored />
          <p className="text-xs text-slate-500 mt-2">鏡像（左右反転）</p>
        </div>
      </div>
    );
  }

  if (displayMode === 'rotation') {
    const rotated =
      shapes.find((s) => s.rotation !== questionShape.rotation) ??
      ({ ...questionShape, rotation: 180 as const });
    return (
      <div className="flex justify-center items-center gap-6 my-6">
        <div className="text-center">
          <ShapeSvg shape={questionShape} />
          <p className="text-xs text-slate-500 mt-2">もとの形</p>
        </div>
        <span className="text-slate-400 text-lg">↻</span>
        <div className="text-center">
          <ShapeSvg shape={rotated} />
          <p className="text-xs text-slate-500 mt-2">回転後</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${margin}`}>
      <ShapeSvg shape={questionShape} />
    </div>
  );
}
