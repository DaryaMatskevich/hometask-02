import { ObjectId } from "mongodb"

export type BlogViewType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogDBType = {
    _id: ObjectId
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