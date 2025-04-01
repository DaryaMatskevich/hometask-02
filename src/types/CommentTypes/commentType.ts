import { ObjectId } from "mongodb";

type CommentatorInfo = {
    userId: string;
    userLogin: string;
  };

export type CommentInputType = {
    postId: string
    content: string
    commentatorInfo: CommentatorInfo
    createdAt: string
}


  
  export type CommentViewType = {
    id: string;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
  };
  
  export type PaginatedComments = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: CommentViewType[];
  };


  export type CommentDBType = {
    _id: ObjectId;
    content: string;
    commentatorInfo: CommentatorInfo;
    createdAt: string;
    postId: string;
  };