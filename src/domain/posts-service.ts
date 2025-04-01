import { PaginatedPosts, PostsFilter, PostViewType } from "../types/PostTypes/PostViewType";
import { postsRepository } from "../Repository/postsRepository";


export const postsService = {

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId?: string)
        : Promise<PaginatedPosts<PostViewType>> {
        const filter: PostsFilter = blogId ? {blogId}:{}
        const posts = await postsRepository.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter
        );
        const postsCount = await postsRepository.getPostsCount(filter)
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts

        }
    },

    async findPostById(id: string): Promise<PostViewType | null> {
        return await postsRepository.findPostById(id)
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewType | null> {
        return await postsRepository.createPost(title, shortDescription, content, blogId)

    },

    async updatePost(id: string, title: string, shortDescription: string,
        content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },

    async deletePostById(id: string): Promise<boolean> {
        return await postsRepository.deletePostById(id)
    },
}