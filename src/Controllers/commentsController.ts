import { Request, Response } from "express";
import { CommentsService } from "../domain/comments-service";
import { CommentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { ResultStatus } from "../types/result/resultCode";
import { resultCodeToHttpException } from "../types/result/resultCodeToHttpStatus";



export class CommentsController {

    constructor(
        private commentsService: CommentsService,
        private commentsQueryRepository: CommentsQueryRepository
    ) {
    }

    async getCommentById(req: Request, res: Response) {
        const commentId = req.params.id
        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (comment) {
            res.status(200).send(comment)
        }
        else {
            res.sendStatus(404)
        }
    }

    async updateCommentById(req: Request, res: Response) {
        const { content } = req.body;
        const commentId = req.params.id

        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!comment) {
            res.sendStatus(404)
            return
        }
        if (req.user!.userId !== comment!.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        let isUpdated = await this.commentsService.updateComment(commentId, content)
        if (isUpdated) {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(404)
            return
        }
    }

    async deleteCommentById(req: Request, res: Response): Promise<any> {

        const comment = await this.commentsQueryRepository.getCommentById(req.params.id)
        if (!comment) {
            return res.sendStatus(404)
        }


        if (req.user!.userId !== comment!.commentatorInfo.userId) {
            return res.sendStatus(403)
        }
        const isDeleted = await this.commentsService.deleteCommentById(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    }

    async changeLikeStatus(req: Request, res: Response) {
        const commentId = req.params.id
        const likeStatus = req.body.likeStatus
        const userId = req.user!.userId
        const result = await this.commentsService.changeLikeStatus(userId, commentId, likeStatus)



        if (result.status === ResultStatus.NotFound) {
            res.status(resultCodeToHttpException(result.status)).json({errorsMessages: result.extensions})
       return
        } 

        if (result.status === ResultStatus.Success) {
            res.sendStatus(resultCodeToHttpException(result.status))
       return
        } 
        if (result.status === ResultStatus.BadRequest) {
            res.status(resultCodeToHttpException(result.status)).json({errorsMessages: result.extensions})
       return
        } 

        }
    }
