/**
 * Конвертер даты при чтении из БД
 * - в БД значение времени сохраняется без указания смещения: 2024-05-28 16:16:12.923, т.е. без знания часового пояса
 * - в JavaScript каждый объект Date если не получает явного указания временной зоны - приводится к _текущей_ временной зоне
 * - это приводит к следующему эффекту:
 *    - в случае записи в БД: Node.js -> (new Date()).toISOString() -> UTC -> DB (без указания tz)
 *      --- всё в порядке при записи
 *    - в случае чтения из БД: DB -> UTC дата без tz -> Node.js -> new Date(*) часы в UTC становятся часами в _текущем_ часовом поясе сервера
 *      --- при чтении из БД дате, что считается как UTC, присваивается часовой пояс сервера
 * - чтобы компенсировать разницу при чтении дат, данная функция рассчитывает временное смещение приложения/сервера
 * где оно запущенно и восполняет разницу для значения прочитанного из БД
 */
export function getUTCTime(dbDateTimeString: Date | string): Date {
  const dateTime = new Date(typeof dbDateTimeString === 'string' ? dbDateTimeString : dbDateTimeString.toISOString());

  // представление времени в миллисекундах
  const dateTimeInMs = dateTime.getTime();

  // получение смещения в миллисекундах:
  // getTimezoneOffset возвращает смещение в минутах, к примеру для Москвы результат будет -180, в одной минуте 60_000 мс
  const dateTimeOffsetInMs = dateTime.getTimezoneOffset() * 60000;

  // формирование результата
  const dateTimeUTC = new Date();
  dateTimeUTC.setTime(dateTimeInMs - dateTimeOffsetInMs);

  return dateTimeUTC;
}
