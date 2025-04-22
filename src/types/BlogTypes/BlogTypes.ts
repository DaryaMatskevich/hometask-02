

export type BlogDBType = {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
};

export interface PaginatedResponse<T> {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: T[]
}

export interface FilterOptions {
  name?: {
    $regex: string;
    $options: string;
  };
}