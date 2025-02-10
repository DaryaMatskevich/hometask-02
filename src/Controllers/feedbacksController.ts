import { Request, Response, Router } from "express";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { feedbacksService } from "../domain/feedbacks-service";

export const feedbacksRouter = Router({})

feedbacksRouter.post('/', authMiddleware,
    async (req: Request, res: Response) => {
        const newFeedback = feedbacksService.sendFeedback(req.body.comment, req.user!._id)
        res.status(201).send(newFeedback)
    })
    feedbacksRouter.get('/', async(req: Request, res: Response) => {
        const users = await feedbacksService.allFeedbacks()
        res.send(users)
    })
