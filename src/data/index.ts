import type { AgeGroup, Category, Question } from '../types';
import { TEST_QUESTIONS_PER_CATEGORY } from '../types';
import { elementaryLowerQuestions } from './questions/elementaryLower';
import { elementaryUpperQuestions } from './questions/elementaryUpper';
import { juniorHighQuestions } from './questions/juniorHigh';
import { standardQuestions } from './questions/standard';
import { advancedQuestions } from './questions/advanced';
import { universityQuestions } from './questions/university';
import { adultQuestions } from './questions/adult';

function dedupeByPrompt(questions: Question[]): Question[] {
  const map = new Map<string, Question>();
  for (const q of questions) {
    map.set(`${q.category}::${q.prompt}`, q);
  }
  return [...map.values()];
}

const juniorHighPool = dedupeByPrompt([
  ...juniorHighQuestions,
  ...standardQuestions.filter(
    (q) => q.difficulty <= 2 || (q.difficulty === 3 && q.category !== 'logic')
  ),
]);

const seniorHighQuestions = dedupeByPrompt(standardQuestions);

const universityPool = dedupeByPrompt([
  ...universityQuestions,
  ...standardQuestions.filter((q) => q.difficulty >= 2),
  ...advancedQuestions,
]);

const adultPool = dedupeByPrompt([
  ...adultQuestions,
  ...standardQuestions.filter((q) => q.difficulty === 3),
  ...advancedQuestions,
]);

const QUESTIONS_BY_AGE: Record<AgeGroup, Question[]> = {
  elementary_lower: dedupeByPrompt(elementaryLowerQuestions),
  elementary_upper: dedupeByPrompt(elementaryUpperQuestions),
  junior_high: juniorHighPool,
  senior_high: seniorHighQuestions,
  university: universityPool,
  adult: adultPool,
};

const CATEGORIES: Category[] = ['matrix', 'numeric', 'verbal', 'logic', 'spatial'];

export function getQuestionsForAgeGroup(ageGroup: AgeGroup): Question[] {
  return QUESTIONS_BY_AGE[ageGroup];
}

function pickTestQuestions(pool: Question[], perCategory: number): Question[][] {
  return CATEGORIES.map((cat) => {
    const available = pool.filter((q) => q.category === cat);
    const count = Math.min(perCategory, available.length);
    return [...available].sort(() => Math.random() - 0.5).slice(0, count);
  });
}

function interleaveByCategory(grouped: Question[][]): Question[] {
  const result: Question[] = [];
  const maxLen = Math.max(...grouped.map((g) => g.length));
  for (let i = 0; i < maxLen; i++) {
    for (const group of grouped) {
      if (group[i]) result.push(group[i]);
    }
  }
  return result;
}

export function getTestQuestionCount(ageGroup: AgeGroup): number {
  const perCategory = TEST_QUESTIONS_PER_CATEGORY[ageGroup];
  const pool = getQuestionsForAgeGroup(ageGroup);
  return CATEGORIES.reduce((sum, cat) => {
    const available = pool.filter((q) => q.category === cat).length;
    return sum + Math.min(perCategory, available);
  }, 0);
}

export function getShuffledQuestions(ageGroup: AgeGroup): Question[] {
  const pool = getQuestionsForAgeGroup(ageGroup);
  const perCategory = TEST_QUESTIONS_PER_CATEGORY[ageGroup];
  return interleaveByCategory(pickTestQuestions(pool, perCategory));
}

/** 問題庫の総数（バリエーション数） */
export function getPoolQuestionCount(ageGroup: AgeGroup): number {
  return getQuestionsForAgeGroup(ageGroup).length;
}

/** 本番テストのカテゴリ別出題数 */
export function getCategoryCounts(ageGroup: AgeGroup): Record<Category, number> {
  const perCategory = TEST_QUESTIONS_PER_CATEGORY[ageGroup];
  const pool = getQuestionsForAgeGroup(ageGroup);
  const counts = {} as Record<Category, number>;
  for (const cat of CATEGORIES) {
    const available = pool.filter((q) => q.category === cat).length;
    counts[cat] = Math.min(perCategory, available);
  }
  return counts;
}

export function getEstimatedMinutes(ageGroup: AgeGroup): string {
  const perCategory = TEST_QUESTIONS_PER_CATEGORY[ageGroup];
  const pool = getQuestionsForAgeGroup(ageGroup);
  let totalSeconds = 0;

  for (const cat of CATEGORIES) {
    const catQuestions = pool.filter((q) => q.category === cat);
    const take = Math.min(perCategory, catQuestions.length);
    if (take === 0) continue;
    const avgTime =
      catQuestions.reduce((sum, q) => sum + q.timeLimit, 0) / catQuestions.length;
    totalSeconds += avgTime * take;
  }

  const minMinutes = Math.max(1, Math.round(totalSeconds / 60));
  const maxMinutes = Math.max(minMinutes + 1, Math.round((totalSeconds * 1.12) / 60));
  return `約${minMinutes}〜${maxMinutes}分`;
}
