import type { AgeGroup } from '../types';
import {
  AGE_GROUP_DESCRIPTIONS,
  AGE_GROUP_HINTS,
  AGE_GROUP_ICONS,
  AGE_GROUP_LABELS,
} from '../types';
import { getEstimatedMinutes, getPoolQuestionCount, getTestQuestionCount } from '../data';

interface Props {
  onSelect: (ageGroup: AgeGroup) => void;
  onBack: () => void;
}

const AGE_GROUPS: AgeGroup[] = [
  'elementary_lower',
  'elementary_upper',
  'junior_high',
  'senior_high',
  'university',
  'adult',
];

export function AgeGroupScreen({ onSelect, onBack }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">年代を選んでください</h2>
          <p className="text-slate-400">
            あなたの年代に合った問題と基準でテストを行います
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {AGE_GROUPS.map((group) => {
            const testCount = getTestQuestionCount(group);
            const poolCount = getPoolQuestionCount(group);
            const minutes = getEstimatedMinutes(group);
            return (
              <button
                key={group}
                onClick={() => onSelect(group)}
                className="text-left bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{AGE_GROUP_ICONS[group]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-lg group-hover:text-blue-200 transition-colors">
                      {AGE_GROUP_LABELS[group]}
                    </div>
                    <div className="text-xs text-blue-300/80 mt-0.5">{AGE_GROUP_HINTS[group]}</div>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                      {AGE_GROUP_DESCRIPTIONS[group]}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-slate-500">
                      <span>📝 {testCount}問出題</span>
                      <span>⏱ {minutes}</span>
                      {poolCount > testCount && (
                        <span className="text-slate-600">（問題庫{poolCount}問）</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="w-full py-3 px-8 text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← 戻る
        </button>
      </div>
    </div>
  );
}
