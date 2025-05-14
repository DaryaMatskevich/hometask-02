import { PaginatedPosts, PostsFilter, PostDBType } from "../types/PostTypes/PostDBType";
import { PostsRepository } from "../Repository/postsRepository";
import { BlogsRepository } from "../Repository/blogsRepository";
import { CommentsQueryRepository } from "../queryRepository/commentsQueryRepository";


export class PostsService {


    constructor(private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
        private commentsQueryRepository: CommentsQueryRepository
    ) {

    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<any> {
        const blog = await this.blogsRepository.findBlogById(blogId)
        if (!blog) { return null }
        if (blog) {
            const newPost = {
                id: (Date.now() + Math.random()).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: (new Date()).toISOString()
            };
            const postId = await this.postsRepository.createPost(newPost)
            if (postId) {
                const post = await this.postsRepository.findPostById(postId)
                return post || null
            }
        }
    }

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId?: string)
        : Promise<PaginatedPosts<PostDBType>> {
        const filter: PostsFilter = blogId ? { blogId } : {}
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

    async findPostById(id: string): Promise<PostDBType | null> {
        return await this.postsRepository.findPostById(id)
    }

    async updatePost(id: string, title: string, shortDescription: string,
        content: string, blogId: string): Promise<boolean> {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, blogId)
    }

    async deletePostById(id: string): Promise<boolean> {
        return await this.postsRepository.deletePostById(id)
    }

    async getCommentsByPostId(postId: string, pageNumber: number, pageSize: number,
        sortBy: string, sortDirection: 'asc' | 'desc') {
        const comments = await this.commentsQueryRepository.getCommentsByPostId(postId, pageNumber,
            pageSize, sortBy, sortDirection)
        return comments
    }

    async getCommentsByPostIdforAuth(postId: string, pageNumber: number, pageSize: number,
        sortBy: string, sortDirection: 'asc' | 'desc', userId: string) {
         
        const comments = await this.commentsQueryRepository.getCommentsByPostId(postId, pageNumber,
            pageSize, sortBy, sortDirection, userId)
        return comments
    }}
