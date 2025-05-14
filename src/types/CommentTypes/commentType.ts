import { ObjectId } from "mongodb";

type CommentatorInfo = {
    userId: string;
    userLogin: string;
  };

  type LikesInfo = {
    likesCount: number;
     dislikesCount: number;
     myStatus: string
     
  };

export type CommentInputType = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
    likesInfo: {
      likesCount: number;
     dislikesCount: number;
    }
}

  
  export type CommentViewType = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    likesInfo: LikesInfo;
  };
  
  export type PaginatedComments = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewType[];
  };


  export type CommentDBType = {
    postId: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    likesInfo: LikesInfo
  };