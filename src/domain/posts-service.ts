import { PaginatedPosts, PostsFilter, PostDBType } from "../types/PostTypes/PostDBType";
import { PostsRepository } from "../Repository/postsRepository";
import { BlogsRepository } from "../Repository/blogsRepository";
import { CommentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { ResultStatus } from "../types/result/resultCode";
import { LikesPostQueryRepository } from "../queryRepository/likesPostQueryRepository";
import { LikesPostRepository } from "../Repository/likesPostRepository";
import { Result } from "../types/result/result.type";


export class PostsService {


    constructor(private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private likesPostRepository: LikesPostRepository,
        private likesPostQueryRepository: LikesPostQueryRepository
    ) {

    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<any> {
        const blog = await this.blogsRepository.findBlogById(blogId)
        if (!blog) { return null }
        if (blog) {
            const newPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: (new Date()).toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    newestLikes: []
                }
            };
            const postId = await this.postsRepository.createPost(newPost)
            if (postId) {
                const post = await this.postsRepository.getPostById(postId)
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

    async getPostById(id: string): Promise<PostDBType | null> {
        const result = await this.postsRepository.getPostById(id)
        return result
    }

    async getPostByIdforAuth(userId: string, postId: string): Promise<PostDBType | null> {
        const currentStatus = await this.likesPostQueryRepository.getLikeStatusByUserId(userId, postId)

        const post = await this.postsRepository.getPostById(postId, currentStatus)
        if (!post) {
            return null
        }
        else {
            return post
        }
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
    }

    async changeLikeStatus(
        postId: string,
        userId: string,
        login: string,
        likeStatus: string
    ): Promise<Result<boolean>> {
        const post = await this.postsRepository.getPostById(postId)
        if (!post) {
            return {
                status: ResultStatus.NotFound,
                data: false,
                errorMessage: 'Comment not found',
                extensions: [{
                    field: 'likeStatus',
                    message: 'Comment not found'
                }]
            }
        }

        if (!['Like', 'Dislike', 'None'].includes(likeStatus)) {
            return {
                status: ResultStatus.BadRequest,
                data: false,
                errorMessage: 'Invalid like status',
                extensions: [{
                    message: 'Status must be Like, Dislike or None',
                    field: 'likeStatus',

                }]
            };
        }
        
        const currentStatus = await this.likesPostQueryRepository.getLikeStatusByUserId(userId, postId)

        if (likeStatus === currentStatus) {
            return {
                status: ResultStatus.Success,
                data: true,
                extensions: []
            }
        }
        // Обновляем счетчики в комментарии
        if (currentStatus === 'Like') {
            await this.postsRepository.decreaseLikes(postId)
        } else if (currentStatus === 'Dislike') {
            await this.postsRepository.decreaseDislikes(postId)
        }

        if (likeStatus === 'Like') {
            await this.postsRepository.increaseLikes(postId)
        } else if (likeStatus === 'Dislike') {
            await this.postsRepository.increaseDisLikes(postId)
        }


        let result: boolean;

        if (currentStatus === null) {
            result = await this.likesPostRepository.createStatus(
                userId,
                postId,
                likeStatus
            );
        } else {
            result = await this.likesPostRepository.setStatus(
                userId,
                postId,
                likeStatus
            );

        }
const updateNewestLikes = await this.postsRepository.updateNewestLikes(postId, userId, login, likeStatus)

        if (!result) {
            return {
                status: ResultStatus.BadRequest,
                data: false,
                errorMessage: `Failed to update status to ${likeStatus}`,
                extensions: []
            };
        }

        return {
            status: ResultStatus.Success,
            data: true,
            extensions: []
        };
    }
}
