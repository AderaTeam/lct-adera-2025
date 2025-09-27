/**
 * Проверка валидного objectKey
 *
 * Пример:
 * 20250404_081dd8c307854ac0a04cc92f1127fa2c.pdf
 *
 * Формула:
 * `${yyyyMMdd}_${randomUUID().replace(/-/g, '')}${fileExtension}`;
 */
export function isValidObjectKey(objectKey: unknown): boolean {
  if (typeof objectKey !== 'string') return false;
  return /\d\d\d\d\d\d\d\d_([a-z]|[A-Z]|\d){32}\.([a-z]|[A-Z]|\d)*/gi.test(objectKey);
}
