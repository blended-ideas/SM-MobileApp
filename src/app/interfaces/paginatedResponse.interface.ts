export interface PaginatedResponseInterface<T> {
  count: number;
  results: T[];
  next: string;
  previous: string;
}
