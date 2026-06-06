import { EXPLANATIONS } from '../data/explanations';
import type { Question } from '../types';

export function getQuestionExplanation(question: Question): string {
  return question.explanation ?? EXPLANATIONS[question.id] ?? 'この問題の解説は準備中です。';
}
