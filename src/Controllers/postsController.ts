import { Request, Response, Router } from "express"
import { postsService } from "../domain/posts-service"
import { authMiddleware } from "../Middlewares/authMiddleware"
import { blogIdValidation, contentValidation, inputValidationMiddleware, shortDescriptionValidation, titleValidation } from "../Middlewares/middlewares"
import { SortDirection } from "mongodb"
import { commentsService } from "../domain/comments-service"
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware"
import { commentValidation } from "../Middlewares/middlewares"
import { commentsQueryRepository } from "../queryRepository/commentsQueryRepository"
import { postsRepository } from "../Repository/postsRepository"

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection =
        req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
            ? 'asc'
            : 'desc'

    const foundPosts = await postsService.findPosts(
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    )
    res.status(200).send(foundPosts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    let post = await postsService.findPostById(req.params.id)
    if (post) {
        res.status(200).send(post)
    }
    else { res.sendStatus(404) }
})

postsRouter.post('/', authMiddleware, blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(201).send(newPost)
})

postsRouter.put('/:id', authMiddleware, blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    let isUpdated = await postsService.updatePost(req.params.id, title, shortDescription, content, blogId)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
)

postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await postsService.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    }
    res.sendStatus(404)
})

postsRouter.get('/:id/comments', async (req: Request, res: Response) => {
    const postId = req.params.id
    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection =
        req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
            ? 'asc'
            : 'desc'
    const post = await postsRepository.findPostById(postId)
    if (!post) {
        res.sendStatus(404)
        return
    }
    const comments = await commentsQueryRepository.getCommentsByPostId(postId, pageNumber,
        pageSize, sortBy, sortDirection)
    if (comments) {
        res.status(200).send(comments)
    }
    else { res.sendStatus(404) }
})

postsRouter.post('/:id/comments', userAuthMiddleware, commentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const postId = req.params.id;
    const { content } = req.body;
    const userLogin = req.user!.login;
    const userId = req.user!.userId
    const post = await postsRepository.findPostById(postId)
    if (!post) {
        res.sendStatus(404)
        return
    }
    const commentId = await commentsService.createComment(postId, content, userLogin, userId);
    if (!commentId) {
        res.sendStatus(500)
        return
    }
    const newComment = await commentsQueryRepository.getCommentById(commentId)
    if (!newComment) {
        res.sendStatus(500)
        return
    } else {
    res.status(201).send(newComment)
    }
})