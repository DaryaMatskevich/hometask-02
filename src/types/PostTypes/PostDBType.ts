export type PostDBType = {
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: {
    likesCount: number,
    dislikesCount: number,
    newestLikes: 
      {
        addedAt: string,
        userId: string,
        login: string
      }[];
  }
};

export type PostViewType = {
  id: string,
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendeslikesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: 
      {
        addedAt: string,
        userId: string,
        login: string
      }[];
  }
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