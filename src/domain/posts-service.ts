import { PostViewModel } from "../types/PostsViewModel";
import { postsRepository } from "../Repository/postsRepository";


export const postsService = {

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId?: string)
        : Promise<any> {
           
        const posts = await postsRepository.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        )
        const postsCount = await postsRepository.getPostsCount()
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts

        }
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        return await postsRepository.findPostById(id)
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {
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