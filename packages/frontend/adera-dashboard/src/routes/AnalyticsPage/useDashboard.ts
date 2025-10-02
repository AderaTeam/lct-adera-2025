import { useQuery } from '@tanstack/react-query';
import { useAuthFetch } from '@adera/auth-fetch';
import { FiltersState } from 'features/Filters';
import { ApiDashboard } from 'store/_types';

function toApiParams(filters: FiltersState): URLSearchParams {
  const params = new URLSearchParams();

  const { topics, sources, from, to } = filters;

  if (topics && topics !== 'all') params.set('topics', topics);
  if (sources && sources !== 'all') params.set('sources', sources);

  if (from && to) {
    params.set('from', from);
    params.set('to', to);
  }

  return params;
}

export function useDashboard(filters: FiltersState) {
  const authFetch = useAuthFetch();

  return useQuery<ApiDashboard>({
    queryKey: ['analytics-dashboard', filters],
    queryFn: () => {
      const params = toApiParams(filters);

      return authFetch(`/analytics/dashboard?${params}`);
    },
    placeholderData: (prev) => prev
  });
}
