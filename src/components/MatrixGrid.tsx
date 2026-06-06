import { Fragment } from 'react';
import type { MatrixVisual } from '../types';

interface Props {
  visual: MatrixVisual;
}

export function MatrixGrid({ visual }: Props) {
  const { grid } = visual;

  return (
    <div className="flex justify-center my-6">
      <div className="inline-block p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: 'auto repeat(3, 1fr)', gridTemplateRows: 'auto repeat(3, 1fr)' }}
        >
          <div className="w-12 h-8" />

          {[1, 2, 3].map((col) => (
            <div
              key={`col-${col}`}
              className="h-8 flex items-center justify-center text-xs font-semibold text-blue-600 bg-blue-50 rounded-t-md"
            >
              {col}列目
            </div>
          ))}

          {grid.map((row, rowIndex) => (
            <Fragment key={`row-${rowIndex}`}>
              <div className="w-12 flex items-center justify-center text-xs font-semibold text-violet-600 bg-violet-50 rounded-l-md">
                {rowIndex + 1}行目
              </div>
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-20 h-20 flex items-center justify-center text-3xl font-bold border-2 ${
                    cell === null
                      ? 'border-dashed border-blue-400 bg-blue-50 text-blue-500 rounded-lg'
                      : rowIndex % 2 === colIndex % 2
                        ? 'border-slate-300 bg-white text-slate-700 rounded-lg'
                        : 'border-slate-200 bg-slate-100/80 text-slate-700 rounded-lg'
                  }`}
                >
                  {cell === null ? '?' : cell}
                </div>
              ))}
            </Fragment>
          ))}
        </div>

        <div className="flex justify-center gap-6 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-violet-100 border border-violet-200" />
            横＝行（→）
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-sm bg-blue-100 border border-blue-200" />
            縦＝列（↓）
          </span>
        </div>
      </div>
    </div>
  );
}
