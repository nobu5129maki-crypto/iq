import type { Question, SpatialVisual } from '../types';

export function getSpatialAnswerVisual(question: Question): SpatialVisual | null {
  if (question.category !== 'spatial' || !question.spatial) return null;

  const { spatial } = question;
  const shape = spatial.questionShape;
  const correct = question.options[question.correctIndex];

  if (spatial.displayMode === 'cubeNet') {
    return { shapes: [], displayMode: 'cubeNet', highlightFaces: [1, 3] };
  }

  if (spatial.displayMode === 'foldCut') {
    return { shapes: [], displayMode: 'foldCut' };
  }

  if (spatial.displayMode === 'tetrahedron') {
    return { shapes: [], displayMode: 'tetrahedron' };
  }

  if (spatial.displayMode === 'orthographic' || correct === '立方体') {
    return { shapes: [], displayMode: 'cube' };
  }

  if (!shape) return null;

  if (correct.includes('90°回転のみ')) {
    return {
      shapes: [],
      questionShape: { ...shape, rotation: 90 },
      displayMode: 'single',
    };
  }

  if (correct === '下' || correct === 'した') {
    return {
      shapes: [],
      questionShape: { ...shape, rotation: 180 },
      displayMode: 'single',
    };
  }

  if (
    spatial.displayMode === 'mirror' ||
    correct.includes('左右反転') ||
    correct.includes('左右が反転') ||
    correct.includes('ひっくりかえす')
  ) {
    return {
      shapes: [],
      questionShape: shape,
      displayMode: 'mirror',
    };
  }

  if (correct.includes('同じ') || correct.includes('おなじ')) {
    return {
      shapes: [],
      questionShape: shape,
      displayMode: 'single',
    };
  }

  return {
    shapes: [],
    questionShape: shape,
    displayMode: 'single',
  };
}
