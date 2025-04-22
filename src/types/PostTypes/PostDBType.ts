export type PostDBType = {
      id: string
      title: string
      shortDescription: string
      content: string
      blogId: string
      blogName: string
      createdAt: string
    };
  

    export type PaginatedPosts<T> = {
      pagesCount: number;
      page: number;
      pageSize: number;
      totalCount: number;
      items: T[];
    };

    export type PostsFilter = {
      blogId?: string;
    };