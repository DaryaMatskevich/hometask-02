import { Request, Response, Router } from "express";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { commentsService } from "../domain/comments-service";

export const commentsRouter = Router({})

// commentsRouter.post('/', userAuthMiddleware,
//     async (req: Request, res: Response) => {
//         const newFeedback = commentsService.sendComment(req.body.comment, req.user!._id)
//         res.status(201).send(newFeedback)
//     })

    commentsRouter.get('/', async(req: Request, res: Response) => {
        const users = await commentsService.allComments()
        res.send(users)
    })

    commentsRouter.put('/:id', userAuthMiddleware, async (req: Request, res: Response) => {
        
    })

    commentsRouter.delete('/:id', userAuthMiddleware, async (req: Request, res: Response) => {

    })