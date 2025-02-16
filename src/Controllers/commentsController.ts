import { Request, Response, Router } from "express";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { commentsService } from "../domain/comments-service";
import { commentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { commentValidation, inputValidationMiddleware } from "../Middlewares/middlewares";

export const commentsRouter = Router({})

// commentsRouter.post('/', userAuthMiddleware,
//     async (req: Request, res: Response) => {
//         const newFeedback = commentsService.sendComment(req.body.comment, req.user!._id)
//         res.status(201).send(newFeedback)
//     })

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id
    const comment = await commentsQueryRepository.getCommentById(commentId)
    if (comment) {
        res.status(200).send(comment)
    }
    else {
        res.sendStatus(404)
    }
})

commentsRouter.put('/:id', userAuthMiddleware, commentValidation, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const { content } = req.body;
        const commentId = req.params.id

        const comment = await commentsQueryRepository.getCommentById(commentId)
        if (!comment) {
            res.sendStatus(404)
        }
        if (comment?.commentatorInfo.userId.toString() !== req.user!.userId) {
            res.sendStatus(403)
        }
        let isUpdated = await commentsService.updateComment(commentId, content)
        if (isUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

commentsRouter.delete('/:id', userAuthMiddleware,
    async (req: Request, res: Response): Promise<any> => {
        const comment = await commentsQueryRepository.getCommentById(req.params.id)
        if (!comment) {
            return res.sendStatus(404)}

        if (req.user!.userId !== comment?.commentatorInfo.userId.toString()) {
            return res.sendStatus(403)
        }
        const isDeleted = await commentsService.deleteCommentById(req.params.id)
        if (isDeleted) {
           return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    })