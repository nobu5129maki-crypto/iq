import type { AgeGroup, Answer, Category, CategoryScore, TestResult } from '../types';
import { AGE_GROUP_LABELS, CATEGORY_LABELS } from '../types';

const DIFFICULTY_WEIGHTS: Record<1 | 2 | 3, number> = {
  1: 1,
  2: 2,
  3: 3,
};

const ALL_CATEGORIES: Category[] = ['matrix', 'numeric', 'verbal', 'logic', 'spatial'];

function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return 0.5 * (1.0 + sign * y);
}

function getClassification(iq: number, ageGroup: AgeGroup): string {
  const isChild = ageGroup === 'elementary_lower' || ageGroup === 'elementary_upper';
  if (iq >= 145) return isChild ? 'とてもすばらしい' : '非常に優秀（天才域）';
  if (iq >= 130) return isChild ? 'とてもよくできました' : '優秀';
  if (iq >= 120) return isChild ? 'よくできました' : 'やや優秀';
  if (iq >= 110) return isChild ? 'がんばりました' : '平均より上';
  if (iq >= 90) return isChild ? 'ふつう' : '平均';
  if (iq >= 80) return isChild ? 'もうすこし' : '平均より下';
  if (iq >= 70) return isChild ? 'れんしゅうしよう' : '境界域';
  return isChild ? 'つぎはがんばろう' : '要支援域';
}

const AGE_NORMS: Record<AgeGroup, { meanRatio: number; spread: number }> = {
  elementary_lower: { meanRatio: 0.42, spread: 3.0 },
  elementary_upper: { meanRatio: 0.46, spread: 2.9 },
  junior_high: { meanRatio: 0.48, spread: 2.85 },
  senior_high: { meanRatio: 0.50, spread: 2.8 },
  university: { meanRatio: 0.52, spread: 2.75 },
  adult: { meanRatio: 0.50, spread: 2.8 },
};

export function calculateResult(
  answers: Answer[],
  totalTime: number,
  ageGroup: AgeGroup
): TestResult {
  let rawScore = 0;
  let maxScore = 0;

  for (const answer of answers) {
    const weight = DIFFICULTY_WEIGHTS[answer.difficulty];
    maxScore += weight;
    if (answer.correct) {
      rawScore += weight;
      const timeBonus = answer.timeSpent < 15 ? 0.2 : answer.timeSpent < 30 ? 0.1 : 0;
      rawScore += timeBonus;
      maxScore += 0.2;
    }
  }

  const ratio = maxScore > 0 ? rawScore / maxScore : 0;
  const norm = AGE_NORMS[ageGroup];
  const zScore = (ratio - norm.meanRatio) * norm.spread;
  const iq = Math.round(Math.max(55, Math.min(155, 100 + zScore * 15)));
  const percentile = Math.round(normalCDF((iq - 100) / 15) * 100);

  const categoryScores: CategoryScore[] = ALL_CATEGORIES.map((category) => {
    const catAnswers = answers.filter((a) => a.category === category);
    const correct = catAnswers.filter((a) => a.correct).length;
    const total = catAnswers.length;
    return {
      category,
      label: CATEGORY_LABELS[category],
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });

  return {
    iq,
    percentile,
    rawScore: Math.round(rawScore * 10) / 10,
    maxScore: Math.round(maxScore * 10) / 10,
    totalTime,
    categoryScores,
    classification: getClassification(iq, ageGroup),
    ageGroup,
  };
}

export function getAgeGroupResultLabel(ageGroup: AgeGroup): string {
  return `${AGE_GROUP_LABELS[ageGroup]}向け基準`;
}
