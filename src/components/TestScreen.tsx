import { useEffect, useState, useCallback } from 'react';
import type { Question, Answer } from '../types';
import { CATEGORY_LABELS } from '../types';
import { MatrixGrid } from './MatrixGrid';
import { SpatialDisplay } from './SpatialDisplay';

interface Props {
  questions: Question[];
  onComplete: (answers: Answer[], totalTime: number) => void;
}

export function TestScreen({ questions, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit ?? 45);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [testStartTime] = useState(Date.now());
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const submitAnswer = useCallback(
    (selected: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);

      const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
      const answer: Answer = {
        questionId: currentQuestion.id,
        selectedIndex: selected,
        correct: selected === currentQuestion.correctIndex,
        timeSpent,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty,
      };

      const newAnswers = [...answers, answer];

      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          const totalTime = Math.round((Date.now() - testStartTime) / 1000);
          onComplete(newAnswers, totalTime);
        } else {
          setAnswers(newAnswers);
          setCurrentIndex((i) => i + 1);
          setSelectedIndex(null);
          setTimeLeft(questions[currentIndex + 1].timeLimit);
          setQuestionStartTime(Date.now());
          setIsTransitioning(false);
        }
      }, 400);
    },
    [answers, currentIndex, currentQuestion, isTransitioning, onComplete, questionStartTime, questions, testStartTime]
  );

  useEffect(() => {
    if (isTransitioning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isTransitioning, submitAnswer]);

  const handleSelect = (index: number) => {
    if (isTransitioning) return;
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      submitAnswer(selectedIndex);
    }
  };

  const timerColor =
    timeLeft <= 10 ? 'text-red-500' : timeLeft <= 20 ? 'text-amber-500' : 'text-blue-600';
  const timerPercent = (timeLeft / currentQuestion.timeLimit) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">
              問題 {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-xs font-medium bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[currentQuestion.category]}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full animate-fade-in" key={currentQuestion.id}>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {([1, 2, 3] as const).map((d) => (
                  <span
                    key={d}
                    className={`w-2 h-2 rounded-full ${
                      d <= currentQuestion.difficulty ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                ))}
                <span className="text-xs text-slate-400 ml-1">
                  難易度 {currentQuestion.difficulty}/3
                </span>
              </div>
              <div className={`text-2xl font-bold tabular-nums ${timerColor}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="h-1 bg-slate-100 rounded-full mb-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timerPercent <= 20 ? 'bg-red-500' : timerPercent <= 40 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>

            <p className="text-lg text-slate-800 whitespace-pre-line leading-relaxed mb-2">
              {currentQuestion.prompt}
            </p>

            {currentQuestion.visual && (
              <MatrixGrid visual={currentQuestion.visual} />
            )}

            {currentQuestion.spatial && (
              <SpatialDisplay visual={currentQuestion.spatial} />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={isTransitioning}
                  className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${
                    selectedIndex === index
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                  } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 text-sm mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedIndex === null || isTransitioning}
              className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-white transition-all ${
                selectedIndex !== null && !isTransitioning
                  ? 'bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              回答を確定する
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
