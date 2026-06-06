import type { Answer, Question } from '../types';
import { CATEGORY_LABELS } from '../types';
import { getQuestionExplanation } from '../utils/explanation';
import { MatrixGrid } from './MatrixGrid';
import { SpatialAnswerDisplay } from './SpatialAnswerDisplay';
import { SpatialDisplay } from './SpatialDisplay';

interface Props {
  questions: Question[];
  answers: Answer[];
  onBack: () => void;
}

export function ReviewScreen({ questions, answers, onBack }: Props) {
  const answerMap = new Map(answers.map((a) => [a.questionId, a]));
  const correctCount = answers.filter((a) => a.correct).length;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">おさらい</h2>
          <p className="text-slate-400">
            全{questions.length}問の問題と解説 ・ 正解 {correctCount}/{answers.length}問
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {questions.map((question, index) => {
            const answer = answerMap.get(question.id);
            const isCorrect = answer?.correct ?? false;
            const explanation = getQuestionExplanation(question);

            return (
              <article
                key={question.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-100">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isCorrect ? '○' : '×'}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">問題 {index + 1}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {CATEGORY_LABELS[question.category]}
                    </span>
                    <span className="text-xs text-slate-400">
                      難易度 {question.difficulty}/3
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-slate-800 whitespace-pre-line leading-relaxed mb-4">
                    {question.prompt}
                  </p>

                  {question.visual && <MatrixGrid visual={question.visual} />}
                  {question.spatial && (
                    <SpatialDisplay visual={question.spatial} />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 mb-6">
                    {question.options.map((option, optIndex) => {
                      const isCorrectOption = optIndex === question.correctIndex;
                      const isUserOption =
                        answer && answer.selectedIndex === optIndex && answer.selectedIndex >= 0;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border text-sm ${
                            isCorrectOption
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-medium'
                              : isUserOption
                                ? 'border-rose-300 bg-rose-50 text-rose-800'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border text-xs mr-2">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          {option}
                          {isCorrectOption && (
                            <span className="ml-2 text-xs text-emerald-600">← 正解</span>
                          )}
                          {isUserOption && !isCorrectOption && (
                            <span className="ml-2 text-xs text-rose-600">← あなたの回答</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {answer?.selectedIndex === -1 && (
                    <p className="text-sm text-rose-600 mb-4">※ 時間切れのため不正解となりました</p>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span>🌟</span>
                      <h4 className="font-semibold text-amber-900">やさしい解説</h4>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{explanation}</p>
                    {question.category === 'spatial' && (
                      <SpatialAnswerDisplay question={question} />
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="w-full py-4 px-8 bg-white/10 backdrop-blur-md border border-white/10 text-white font-semibold rounded-xl hover:bg-white/15 transition-all"
        >
          ← 結果画面に戻る
        </button>
      </div>
    </div>
  );
}
