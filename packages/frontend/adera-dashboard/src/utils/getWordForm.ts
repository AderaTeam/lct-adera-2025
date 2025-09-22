/**
 * @param number число сущностей, форму слова, которых нужно получить
 * @param forms массив из 3 строк, форм слова, [ед. число, несколько, мн. число]
 *
 * @returns слова в необходимой форме
 */
export const getWordForm = (number: number, forms: [string, string, string]): string => {
  const absNumber = Math.abs(number);
  const lastTwoDigits = absNumber % 100;
  const lastDigit = absNumber % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return forms[2]; // Множественное число
  }

  if (lastDigit === 1) {
    return forms[0]; // Единственное число
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1]; // Несколько
  }

  return forms[2];
};
