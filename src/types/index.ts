export type Category =
  | 'matrix'
  | 'numeric'
  | 'verbal'
  | 'logic'
  | 'spatial';

export type AgeGroup =
  | 'elementary_lower'
  | 'elementary_upper'
  | 'junior_high'
  | 'senior_high'
  | 'university'
  | 'adult';

export interface Question {
  id: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
  explanation?: string;
  visual?: MatrixVisual;
  spatial?: SpatialVisual;
}

export interface MatrixVisual {
  grid: (string | null)[][];
  missingIndex: number;
}

export type SpatialDisplayMode =
  | 'single'
  | 'mirror'
  | 'rotation'
  | 'cubeNet'
  | 'tetrahedron'
  | 'orthographic'
  | 'foldCut'
  | 'cube';

export interface SpatialVisual {
  shapes: SpatialShape[];
  questionShape?: SpatialShape;
  displayMode?: SpatialDisplayMode;
  highlightFaces?: number[];
}

export interface SpatialShape {
  type: 'triangle' | 'square' | 'circle' | 'diamond' | 'lshape';
  rotation: 0 | 90 | 180 | 270;
  filled: boolean;
  size: 'sm' | 'md' | 'lg';
}

export interface Answer {
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  timeSpent: number;
  category: Category;
  difficulty: 1 | 2 | 3;
}

export interface CategoryScore {
  category: Category;
  label: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface TestResult {
  iq: number;
  percentile: number;
  rawScore: number;
  maxScore: number;
  totalTime: number;
  categoryScores: CategoryScore[];
  classification: string;
  ageGroup: AgeGroup;
}

export type AppPhase = 'welcome' | 'ageSelect' | 'instructions' | 'test' | 'results' | 'review';

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  elementary_lower: '小学生低学年',
  elementary_upper: '小学生高学年',
  junior_high: '中学生',
  senior_high: '高校生',
  university: '大学生',
  adult: '大人',
};

export const AGE_GROUP_HINTS: Record<AgeGroup, string> = {
  elementary_lower: '小学1〜3年生向け',
  elementary_upper: '小学4〜6年生向け',
  junior_high: '中学1〜3年生向け',
  senior_high: '高校1〜3年生向け',
  university: '大学生向け',
  adult: '社会人・大人向け',
};

export const AGE_GROUP_DESCRIPTIONS: Record<AgeGroup, string> = {
  elementary_lower: 'やさしい問題で、かんたんなパターンや言葉の関係を考えます',
  elementary_upper: '小学校で学ぶ知識を使った、基礎的な推理問題です',
  junior_high: '中学校レベルの論理思考とパターン認識を測定します',
  senior_high: '高校生向けの標準的な5領域IQテストです',
  university: '高度な抽象思考と複雑なパターン認識に挑戦します',
  adult: '最も難易度の高い問題で認知能力の上限を測定します',
};

export const AGE_GROUP_ICONS: Record<AgeGroup, string> = {
  elementary_lower: '🌱',
  elementary_upper: '📚',
  junior_high: '🎒',
  senior_high: '🎓',
  university: '🏫',
  adult: '💼',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  matrix: '図形推理',
  numeric: '数列推理',
  verbal: '言語类比',
  logic: '論理推理',
  spatial: '空間認知',
};

/** 年代別の本番テスト出題数（カテゴリごと）。問題庫からランダムに選出する */
export const TEST_QUESTIONS_PER_CATEGORY: Record<AgeGroup, number> = {
  elementary_lower: 3, // 15問・約14分
  elementary_upper: 4, // 20問・約18分
  junior_high: 5,      // 25問・約23分
  senior_high: 6,      // 30問・約28分
  university: 6,       // 30問・約35分
  adult: 6,            // 30問・約38分
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  matrix: 'パターンを見つけて欠けている図形を推測します',
  numeric: '数列の規則性を見つけて次の数を予測します',
  verbal: '言葉の関係性から正しい類推を選びます',
  logic: '論理的に正しい結論を導き出します',
  spatial: '図形の回転・変換を理解して答えを選びます',
};
