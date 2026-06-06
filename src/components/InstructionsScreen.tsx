import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, AGE_GROUP_LABELS } from '../types';
import type { AgeGroup, Category } from '../types';
import { getCategoryCounts, getEstimatedMinutes, getPoolQuestionCount, getTestQuestionCount } from '../data';

interface Props {
  ageGroup: AgeGroup;
  onBegin: () => void;
}

const CATEGORIES: Category[] = ['matrix', 'numeric', 'verbal', 'logic', 'spatial'];

const CATEGORY_ICONS: Record<Category, string> = {
  matrix: '🔷',
  numeric: '🔢',
  verbal: '💬',
  logic: '🧩',
  spatial: '📐',
};

export function InstructionsScreen({ ageGroup, onBegin }: Props) {
  const counts = getCategoryCounts(ageGroup);
  const totalQuestions = getTestQuestionCount(ageGroup);
  const poolCount = getPoolQuestionCount(ageGroup);
  const estimatedMinutes = getEstimatedMinutes(ageGroup);
  const isYoung = ageGroup === 'elementary_lower' || ageGroup === 'elementary_upper';

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-2 text-center">テストの進め方</h2>
        <p className="text-slate-400 text-center mb-2">
          {AGE_GROUP_LABELS[ageGroup]}向けテスト
        </p>
        <p className="text-blue-300/70 text-center text-sm mb-8">
          全{totalQuestions}問 ・ {estimatedMinutes}
          {poolCount > totalQuestions && (
            <span className="block text-slate-500 text-xs mt-1">
              問題庫{poolCount}問からランダムに出題されます
            </span>
          )}
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <div className="space-y-6">
            {[
              {
                num: '1',
                title: isYoung ? 'しずかな ところで うける' : '静かな環境で受験',
                desc: isYoung
                  ? 'しゅうちゅう できる ところで、とぎれずに さいごまで とりくんでね。'
                  : '集中できる場所で、中断せずに最後まで取り組んでください。',
              },
              {
                num: '2',
                title: isYoung ? 'じかんげんれいに ちゅうい' : '制限時間に注意',
                desc: isYoung
                  ? 'もんだいごとに じかんげんれいがあるよ。じかんぎれは まちがいになるよ。'
                  : '各問題には制限時間があります。時間切れの場合は不正解となります。',
              },
              {
                num: '3',
                title: isYoung ? 'ゆっくり かんがえよう' : '直感と論理のバランス',
                desc: isYoung
                  ? 'むずかしい もんだいほど じかんが たくさん あるよ。あせらずに かんがえてね。'
                  : '難しい問題ほど時間が与えられます。焦らず論理的に考えてください。',
              },
              {
                num: '4',
                title: isYoung ? 'もどれないよ' : '戻れません',
                desc: isYoung
                  ? 'こたえを きめたら すぐ つぎの もんだいに すすむよ。ゆっくり えらんでね。'
                  : '回答を確定するとすぐ次の問題に進みます。慎重に選んでください。',
              },
              {
                num: '5',
                title: isYoung ? 'おさらいが できるよ' : 'おさらいができます',
                desc: isYoung
                  ? 'テストが おわったら「おさらい」で もんだいと せつめいが みられるよ。'
                  : 'テスト終了後、結果画面から「おさらい」で全問題の解説を確認できます。',
              },
            ].map((rule) => (
              <div key={rule.num} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {rule.num}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{rule.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4">出題される領域</h3>
            <div className="space-y-3">
              {CATEGORIES.filter((cat) => counts[cat] > 0).map((cat) => (
                <div key={cat} className="flex items-start gap-3">
                  <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {CATEGORY_LABELS[cat]}
                      </span>
                      <span className="text-xs text-slate-400">{counts[cat]}問</span>
                    </div>
                    <span className="text-sm text-slate-500">{CATEGORY_DESCRIPTIONS[cat]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onBegin}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-lg rounded-xl hover:from-blue-600 hover:to-violet-700 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          準備完了 — テスト開始
        </button>
      </div>
    </div>
  );
}
