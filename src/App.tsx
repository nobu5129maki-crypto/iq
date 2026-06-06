import { useState, useCallback } from 'react';
import type { AgeGroup, AppPhase, Answer } from './types';
import { getShuffledQuestions } from './data';
import { calculateResult } from './utils/scoring';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AgeGroupScreen } from './components/AgeGroupScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { TestScreen } from './components/TestScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ReviewScreen } from './components/ReviewScreen';
import type { TestResult } from './types';

function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [questions, setQuestions] = useState(getShuffledQuestions('senior_high'));
  const [result, setResult] = useState<TestResult | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleStart = useCallback(() => {
    setPhase('ageSelect');
  }, []);

  const handleSelectAge = useCallback((group: AgeGroup) => {
    setAgeGroup(group);
    setQuestions(getShuffledQuestions(group));
    setPhase('instructions');
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setPhase('welcome');
  }, []);

  const handleBegin = useCallback(() => {
    if (!ageGroup) return;
    setQuestions(getShuffledQuestions(ageGroup));
    setPhase('test');
  }, [ageGroup]);

  const handleComplete = useCallback(
    (answers: Answer[], totalTime: number) => {
      if (!ageGroup) return;
      const testResult = calculateResult(answers, totalTime, ageGroup);
      setAnswers(answers);
      setResult(testResult);
      setPhase('results');
    },
    [ageGroup]
  );

  const handleRetry = useCallback(() => {
    setResult(null);
    setAnswers([]);
    setAgeGroup(null);
    setPhase('ageSelect');
  }, []);

  const handleOpenReview = useCallback(() => {
    setPhase('review');
  }, []);

  const handleBackToResults = useCallback(() => {
    setPhase('results');
  }, []);

  return (
    <>
      {phase === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      {phase === 'ageSelect' && (
        <AgeGroupScreen onSelect={handleSelectAge} onBack={handleBackToWelcome} />
      )}
      {phase === 'instructions' && ageGroup && (
        <InstructionsScreen ageGroup={ageGroup} onBegin={handleBegin} />
      )}
      {phase === 'test' && (
        <TestScreen questions={questions} onComplete={handleComplete} />
      )}
      {phase === 'results' && result && (
        <ResultsScreen
          result={result}
          onReview={handleOpenReview}
          onRetry={handleRetry}
        />
      )}
      {phase === 'review' && (
        <ReviewScreen
          questions={questions}
          answers={answers}
          onBack={handleBackToResults}
        />
      )}
    </>
  );
}

export default App;
