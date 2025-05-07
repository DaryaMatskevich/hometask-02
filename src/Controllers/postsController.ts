import { Request, Response } from "express"
import { PostsService } from "../domain/posts-service"
import { SortDirection } from "mongodb"
import { CommentsService } from "../domain/comments-service"
import { CommentsQueryRepository } from "../queryRepository/commentsQueryRepository"
import { PostsRepository } from "../Repository/postsRepository"


export class PostsController {

    constructor(private postsService: PostsService,
        private commentsQueryRepository: CommentsQueryRepository,
        private commentsService: CommentsService,
        private postsRepository: PostsRepository
    ) {

    }

    async getPosts(req: Request, res: Response) {
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        let sortDirection: SortDirection =
            req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
                ? 'asc'
                : 'desc'

        const foundPosts = await this.postsService.findPosts(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        )
        res.status(200).send(foundPosts)
    }

    async getPostById(req: Request, res: Response) {
        let post = await this.postsService.findPostById(req.params.id)
        if (post) {
            res.status(200).send(post)
        }
        else { res.sendStatus(404) }
    }

    async createPost(req: Request, res: Response) {
        const { title, shortDescription, content, blogId } = req.body;
        const newPost = await this.postsService.createPost(title, shortDescription, content, blogId);
        res.status(201).send(newPost)
    }

    async updatePostById(req: Request, res: Response) {
        const { title, shortDescription, content, blogId } = req.body;
        let isUpdated = await this.postsService.updatePost(req.params.id, title, shortDescription, content, blogId)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deletePostById(req: Request, res: Response) {
        const isDeleted = await this.postsService.deletePostById(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        }
        res.sendStatus(404)
    }

    async getCommentsByPostId(req: Request, res: Response) {
        const postId = req.params.id
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        let sortDirection: SortDirection =
            req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
                ? 'asc'
                : 'desc'
        const post = await this.postsRepository.findPostById(postId)
        if (!post) {
            res.sendStatus(404)
            return
        }
        const comments = await this.commentsQueryRepository.getCommentsByPostId(postId, pageNumber,
            pageSize, sortBy, sortDirection)
        if (comments) {
            res.status(200).send(comments)
        }
        else { res.sendStatus(404) }
    }

    async createCommentForPost(req: Request, res: Response) {
        const postId = req.params.id;
        const { content } = req.body;
        const userLogin = req.user!.login;
        const userId = req.user!.userId
        const post = await this.postsRepository.findPostById(postId)
        if (!post) {
            res.sendStatus(404)
            return
        }
        const commentId = await this.commentsService.createComment(postId, content, userLogin, userId);
        if (!commentId) {
            res.sendStatus(404)
            return
        }
        const newComment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!newComment) {
            res.sendStatus(404)
            return
        } else {
            res.status(201).send(newComment)
        }
    }
}

