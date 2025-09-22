export function invariant(condition: unknown): asserts condition {
  if (!condition) throw Error('invariant violation');
}
