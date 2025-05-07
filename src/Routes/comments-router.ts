import { Router } from "express";
import { SETTINGS } from "../settings";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { commentValidation, inputValidationMiddleware } from "../Middlewares/middlewares";
import { CommentsController} from "../Controllers/commentsController";
import { ioc } from "../composition-root";

export const commentsRouter = Router()
const commentsController = ioc.getInstance<CommentsController>(CommentsController)
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

commentsRouter.put(SETTINGS.PATH.COMMENTS.ID_LIKE_STATUS,
    userAuthMiddleware,
    commentsController.changeLikeStatus.bind(commentsController)
)