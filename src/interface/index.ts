export interface ResPaging<T> {
  items: T[];
  page: number;
  limit: number;
  canNext: boolean;
}

export interface ReqPaging {
  page: number;
  limit: number;
  search?: string;
}
