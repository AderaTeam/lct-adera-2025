export function normalizeMood(
  mood: string,
): 'positive' | 'negative' | 'neutral' {
  switch (mood) {
    case 'позитивный':
    case 'positive':
      return 'positive';
    case 'негативный':
    case 'negative':
      return 'negative';
    case 'нейтральный':
    case 'neutral':
      return 'neutral';
    default:
      return 'neutral';
  }
}
