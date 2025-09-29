import { useSuspenseQuery } from '@tanstack/react-query';
import { useAuthFetch } from '@adera/auth-fetch';

const useDirectoryQuery = <T>(key: string) => {
  const authFetch = useAuthFetch();
  return useSuspenseQuery<T>({
    queryKey: ['directories', key],
    queryFn: () => authFetch<T>(`/directories/${key}`)
  });
};

const mapToOptions = <T extends { id: number; name: string }>(data?: T[]) => {
  if (!data?.length) return [];

  return data.map(({ id, name }) => ({
    value: String(id),
    label: name
  }));
};

export const useDirectoryOptions = () => {
  const { data: sources } = useDirectoryQuery<{ id: number; name: string }[]>('sources');
  const { data: topics } = useDirectoryQuery<{ id: number; name: string }[]>('topics');
  const { data: reviewsDateRange } = useDirectoryQuery<{
    minDate: string | null;
    maxDate: string | null;
  }>('reviews-date-range');

  return {
    sourceOptions: mapToOptions(sources),
    topicOptions: mapToOptions(topics),
    reviewsDateRangeOptions: reviewsDateRange
  };
};
