import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { blogs, blogsRepository } from "../Repository/blogsRepository"
import { blogsCollection } from "../Repository/db"

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
    return
  } else {
    next()
  }
}

// const blogExists = (value: string) => {
//   const blog = blogs.find(blog => blog.id === value)
//   if (!blog) {
//     throw new Error('Блог не существует');
//   } 
//   return true;
// };

const blogExists = async (value: string) => {
  const blog = await blogsCollection.findOne({id: value})
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