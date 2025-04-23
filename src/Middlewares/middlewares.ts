import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { BlogModel} from "../Repository/db"
import { BlogsService } from "../domain/blogs-service"
import { ioc } from "../composition-root"

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).send({
      errorsMessages: errors
        .array({ onlyFirstError: true })
        .map((err) => {
          return { message: err.msg, field: (err as any).path }
        }),
    })
  } else {
    next()
  }
}
const blogsService = ioc.getInstance<BlogsService>(BlogsService)
export const blogIdExistenseMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const blogId = req.params.id;
  const blog = await blogsService.findBlogById(blogId)
  if (!blog) {
    res.sendStatus(404)
    return
  }
  next()
}

const blogExists = async (value: string) => {
  const blog = await BlogModel.findOne({ id: value })
  if (!blog) {
    throw new Error('Блог не существует');
  }
  return true;
};

export const descriptionValidation = body('description').trim().isLength({ min: 3, max: 500 }).withMessage("Title length should be from 3 to 500 symbols");
export const nameValidation = body('name').trim().isLength({ min: 3, max: 15 }).withMessage("Name length should be from 3 to 15 symbols");
export const websiteUrlValidation = body('websiteUrl').trim().isLength({ min: 3, max: 100 }).withMessage("WebsiteUrl should be from 3 to 100 symbols").isURL().withMessage('Неверный формат URL');

export const titleValidation = body('title').trim().isLength({ min: 3, max: 30 }).withMessage("Title length should be from 3 to 30 symbols");
export const shortDescriptionValidation = body('shortDescription').trim().isLength({ min: 3, max: 100 }).withMessage("Title length should be from 3 to 100 symbols");
export const contentValidation = body('content').trim().isLength({ min: 3, max: 1000 }).withMessage("Content length should be from 3 to 1000 symbols");
export const blogIdValidation = body('blogId').custom(blogExists).withMessage("Blog is not exist")

export const loginValidation = body('login').trim().isLength({ min: 3, max: 10 })
  .withMessage('Login must contain from 3 to 10 symbols').matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('A login can only contain letters, numbers, underscores, and hyphens.')

export const passwordValidation = body('password').trim().isLength({ min: 6, max: 20 })
  .withMessage('Password must contain from 6 to 20 symbols')

export const emailValidation = body('email').trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Email is not right')

export const commentValidation = body('content').trim().isLength({ min: 20, max: 300 }).withMessage("Comment length should be from 20 to 300 symbols");

export const newPasswordValidation = body('newPassword').trim().isLength({ min: 6, max: 20 })
  .withMessage('Password must contain from 6 to 20 symbols')