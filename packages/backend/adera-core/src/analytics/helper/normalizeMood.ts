export function normalizeMood(
  mood: string,
): 'positive' | 'negative' | 'neutral' {
  switch (mood) {
    case 'положительно':
    case 'positive':
      return 'positive';
    case 'отрицательно':
    case 'negative':
      return 'negative';
    case 'нейтрально':
    case 'neutral':
      return 'neutral';
    default:
      return 'neutral';
  }
}
