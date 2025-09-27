import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortDirections } from 'store/_types';

export interface FiltersState {
  sort_review_top: SortDirections;
  sources: string;
  products: string;
}

export const DEFAULT_FILTERS: FiltersState = {
  sort_review_top: SortDirections.asc,
  sources: 'all',
  products: 'all'
};

function parseSortDirection(value: string | null, defaultValue: SortDirections): SortDirections {
  return value === SortDirections.asc || value === SortDirections.desc ? value : defaultValue;
}

export function parseFilters(params: URLSearchParams): FiltersState {
  return {
    sort_review_top: parseSortDirection(params.get('sort_review_top'), DEFAULT_FILTERS.sort_review_top),
    sources: params.get('sources') ?? DEFAULT_FILTERS.sources,
    products: params.get('products') ?? DEFAULT_FILTERS.products
  };
}

export function stringifyFilters(filters: FiltersState): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  });

  return params;
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  const updateFilters = useCallback(
    (patch: Partial<FiltersState>) => {
      setSearchParams((prev) => stringifyFilters({ ...parseFilters(prev), ...patch }));
    },
    [setSearchParams]
  );

  return { filters, updateFilters };
}

export function isDefaultFilters(filters: FiltersState): boolean {
  return Object.entries(DEFAULT_FILTERS).every(([key, value]) => filters[key as keyof FiltersState] === value);
}
