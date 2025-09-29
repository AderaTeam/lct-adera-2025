import { addDays, differenceInDays } from 'date-fns';

export function splitPeriods(
  from: Date,
  to: Date,
  maxPoints = 12,
  minDays = 7,
) {
  const totalDays = differenceInDays(to, from) + 1;
  const numPeriods = Math.min(maxPoints, Math.floor(totalDays / minDays) || 1);
  const periodLength = Math.ceil(totalDays / numPeriods);

  const periods: { start: Date; end: Date }[] = [];
  let start = from;
  while (start <= to) {
    const end = addDays(start, periodLength - 1);
    periods.push({ start, end: end > to ? to : end });
    start = addDays(end, 1);
  }

  return periods;
}
