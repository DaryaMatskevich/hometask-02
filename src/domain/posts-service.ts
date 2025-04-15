import { PaginatedPosts, PostsFilter, PostViewType } from "../types/PostTypes/PostViewType";
import { PostsRepository } from "../Repository/postsRepository";


export class PostsService  {
    

    constructor(private postsRepository: PostsRepository) {
        
    }

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId?: string)
        : Promise<PaginatedPosts<PostViewType>> {
        const filter: PostsFilter = blogId ? {blogId}:{}
        const posts = await this.postsRepository.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            filter
        );
        const postsCount = await this.postsRepository.getPostsCount(filter)
        return {
            pagesCount: Math.ceil(postsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postsCount,
            items: posts

        }
    }

    async findPostById(id: string): Promise<PostViewType | null> {
        return await this.postsRepository.findPostById(id)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewType | null> {
        return await this.postsRepository.createPost(title, shortDescription, content, blogId)

    }

    async updatePost(id: string, title: string, shortDescription: string,
        content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, blogId)
    }

    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }
}