export const calcPercents = (counts: number[]): number[] => {
  const total = counts.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return counts.map(() => 0);
  }

  const rawPercents = counts.map((c) => (c / total) * 100);

  return rawPercents.map((p, i) =>
    i === counts.length - 1 ? 100 - Math.round(rawPercents.slice(0, -1).reduce((a, b) => a + b, 0)) : Math.round(p)
  );
};
