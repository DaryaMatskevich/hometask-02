import { Router } from "express";
import { SETTINGS } from "../settings";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { commentValidation, inputValidationMiddleware } from "../Middlewares/middlewares";
import { commentsController } from "../Controllers/commentsController";

export const commentsRouter = Router()

commentsRouter.get(SETTINGS.PATH.COMMENTS.ID,
    commentsController.getCommentById.bind(commentsController)

)

commentsRouter.put(SETTINGS.PATH.COMMENTS.ID,
    userAuthMiddleware,
    commentValidation,
    inputValidationMiddleware,
    commentsController.updateCommentById.bind(commentsController)
)

commentsRouter.delete(SETTINGS.PATH.COMMENTS.ID,
    userAuthMiddleware,
    commentsController.deleteCommentById.bind(commentsController)

)