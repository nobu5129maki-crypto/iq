import type { TestResult } from '../types';
import { AGE_GROUP_LABELS } from '../types';
import { getAgeGroupResultLabel } from '../utils/scoring';

interface Props {
  result: TestResult;
  onReview: () => void;
  onRetry: () => void;
}

function IQGauge({ iq, isChild }: { iq: number; isChild: boolean }) {
  const minIQ = 55;
  const maxIQ = 155;
  const pct = ((iq - minIQ) / (maxIQ - minIQ)) * 100;
  const angle = -90 + (pct / 100) * 180;

  return (
    <div className="relative w-64 h-36 mx-auto mb-4">
      <svg viewBox="0 0 200 110" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 251.2} 251.2`}
        />
        <line
          x1="100"
          y1="100"
          x2={100 + 60 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 60 * Math.sin((angle * Math.PI) / 180)}
          stroke="#1e293b"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="#1e293b" />
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <div className="text-5xl font-bold text-slate-800 animate-pulse-ring">{iq}</div>
        <div className="text-sm text-slate-500 font-medium">{isChild ? 'スコア' : 'IQ スコア'}</div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}分${s.toString().padStart(2, '0')}秒`;
}

export function ResultsScreen({ result, onReview, onRetry }: Props) {
  const { iq, percentile, classification, categoryScores, totalTime, rawScore, maxScore, ageGroup } = result;
  const isChild = ageGroup === 'elementary_lower' || ageGroup === 'elementary_upper';

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">テスト結果</h2>
          <p className="text-slate-400">
            {AGE_GROUP_LABELS[ageGroup]}向け — あなたの認知能力プロファイル
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <IQGauge iq={iq} isChild={isChild} />

          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 font-semibold rounded-full text-sm">
              {classification}
            </span>
            <p className="text-slate-500 text-sm mt-3">
              {getAgeGroupResultLabel(ageGroup)} ・ 上位{' '}
              <span className="font-bold text-slate-700">{100 - percentile}%</span>
              {' '}(パーセンタイル {percentile})
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-slate-50 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{rawScore}</div>
              <div className="text-xs text-slate-500">得点</div>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="text-2xl font-bold text-slate-800">{maxScore}</div>
              <div className="text-xs text-slate-500">満点</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{formatTime(totalTime)}</div>
              <div className="text-xs text-slate-500">所要時間</div>
            </div>
          </div>

          <h3 className="font-semibold text-slate-800 mb-4">領域別スコア</h3>
          <div className="space-y-4">
            {categoryScores.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{cat.label}</span>
                  <span className="text-slate-500">
                    {cat.correct}/{cat.total} ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-1000"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>免責事項：</strong>
              本テストはウェクスラー式等の正式な心理検査ではありません。
              IQスコアは標準化された近似値であり、医療・教育上の判断には使用しないでください。
              平均IQは100、標準偏差15の正規分布に基づいて換算しています。
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onReview}
            className="flex-1 py-4 px-8 bg-white text-blue-700 font-semibold rounded-xl border-2 border-blue-200 hover:bg-blue-50 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            📖 おさらいを見る
          </button>
          <button
            onClick={onRetry}
            className="flex-1 py-4 px-8 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-violet-700 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            別の年代でもう一度テストする
          </button>
        </div>

        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-3 text-sm">IQ分布の参考</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <span>145+ : 非常に優秀（0.1%）</span>
            <span>130-144 : 優秀（2%）</span>
            <span>120-129 : やや優秀（9%）</span>
            <span>110-119 : 平均より上（16%）</span>
            <span>90-109 : 平均（50%）</span>
            <span>80-89 : 平均より下（16%）</span>
            <span>70-79 : 境界域（2%）</span>
            <span>70未満 : 要支援域</span>
          </div>
        </div>
      </div>
    </div>
  );
}
