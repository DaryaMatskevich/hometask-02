import { Router } from "express";
import { SETTINGS } from "../settings";
import { setTimeout } from "node:timers";
import { blogIdExistenseMiddleware, contentValidation, descriptionValidation, inputValidationMiddleware, nameValidation, shortDescriptionValidation, titleValidation, websiteUrlValidation } from "../Middlewares/middlewares";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { blogsController } from "../Controllers/blogsController";

export const blogsRouter = Router()

blogsRouter.get(SETTINGS.PATH.BLOGS.ROOT,
    blogsController.getBlogs.bind(blogsController)
)

 blogsRouter.get(SETTINGS.PATH.BLOGS.ID,
    blogsController.getBlogById.bind(blogsController)
 )

 blogsRouter.post(SETTINGS.PATH.BLOGS.ROOT,
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController)
 )
 
 blogsRouter.put(SETTINGS.PATH.BLOGS.ID,
    authMiddleware,
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
    inputValidationMiddleware,
    blogsController.updateBlogById.bind(blogsController)
 )
 
 blogsRouter.delete(SETTINGS.PATH.BLOGS.ID,
    authMiddleware,
    blogsController.deleteBlogById.bind(blogsController)
 )
 
 blogsRouter.post(SETTINGS.PATH.BLOGS.ID_POSTS, 
    authMiddleware,
    blogIdExistenseMiddleware,
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    inputValidationMiddleware,
    blogsController.createPostforBlog.bind(blogsController)
 )

 blogsRouter.get(SETTINGS.PATH.BLOGS.ID_POSTS,
    blogIdExistenseMiddleware,
    blogsController.getPostsForBlog.bind(blogsController)
 )
