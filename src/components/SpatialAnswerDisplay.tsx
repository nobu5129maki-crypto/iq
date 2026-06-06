import type { Question } from '../types';
import { getSpatialAnswerVisual } from '../utils/spatialAnswer';
import { SpatialDisplay } from './SpatialDisplay';

interface Props {
  question: Question;
}

export function SpatialAnswerDisplay({ question }: Props) {
  const visual = getSpatialAnswerVisual(question);
  if (!visual) return null;

  const correctLabel = question.options[question.correctIndex];

  return (
    <div className="mt-4 pt-4 border-t border-amber-200">
      <p className="text-sm font-semibold text-emerald-800 mb-3">
        正解の図形：{correctLabel}
      </p>
      <div className="bg-white rounded-lg p-3 border border-emerald-100">
        <SpatialDisplay visual={visual} compact />
      </div>
    </div>
  );
}
