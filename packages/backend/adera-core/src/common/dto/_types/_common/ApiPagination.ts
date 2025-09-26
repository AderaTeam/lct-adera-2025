/**
 * Пагинация
 */
export interface ApiPagination {
  limit: number;
  offset: number;
  totalCount: number;
}

/**
 * Результат с пагинацией
 */
export interface ApiPaginatedResult {
  pagination: ApiPagination;
}
