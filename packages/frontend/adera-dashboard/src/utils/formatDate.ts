interface DateFormatOptions {
  showTime?: boolean; // показать время
  monthStyle?: 'numeric' | '2-digit' | 'short' | 'long'; // стиль месяца
  separator?: string; // разделитель между датой и временем
  fallback?: string; // что вернуть, если дата невалидна
}

export const formatDate = (
  isoString?: string | null,
  { showTime = false, monthStyle = '2-digit', separator = ' ', fallback = '' }: DateFormatOptions = {}
): string => {
  if (!isoString) return fallback;

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return fallback;

  const day = date.getDate().toString().padStart(2, '0');
  const month = new Intl.DateTimeFormat('ru-RU', { month: monthStyle }).format(date);
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const year = date.getFullYear();

  let result = `${day}.${capitalizedMonth}.${year.toString()}`;

  if (showTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    result += `${separator}${hours}:${minutes}`;
  }

  return result;
};
