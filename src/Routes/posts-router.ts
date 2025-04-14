import { Router } from "express";
import { SETTINGS } from "../settings";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { blogIdValidation, commentValidation, contentValidation, inputValidationMiddleware, shortDescriptionValidation, titleValidation } from "../Middlewares/middlewares";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { postsController } from "../Controllers/postsController";

export const postsRouter = Router()

postsRouter.get(SETTINGS.PATH.POSTS.ROOT,
    postsController.getPosts.bind(postsController)
)

postsRouter.get(SETTINGS.PATH.POSTS.ID,
    postsController.getPostById.bind(postsController)
)

postsRouter.post(SETTINGS.PATH.POSTS.ROOT,
    authMiddleware,
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    postsController.createPost.bind(postsController)
)

postsRouter.put(SETTINGS.PATH.POSTS.ID,
    authMiddleware,
    blogIdValidation,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    postsController.updatePostById.bind(postsController)
)

postsRouter.delete(SETTINGS.PATH.POSTS.ID,
    authMiddleware,
    postsController.deletePostById.bind(postsController)
)

postsRouter.get(SETTINGS.PATH.POSTS.ID_COMMENTS,
    postsController.getCommentsByPostId.bind(postsController)
)

postsRouter.post(SETTINGS.PATH.POSTS.ID_COMMENTS,
    userAuthMiddleware,
    commentValidation,
    inputValidationMiddleware,
    postsController.createCommentForPost.bind(postsController)
)


