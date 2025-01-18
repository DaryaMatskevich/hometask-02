import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const errors = validationResult(req)
      if(!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors.array({onlyFirstError: true}).map((err) => {
          return {message: err.msg, field: (err as any).param }
        }),
      }) 
      return
     } else {
        next()
      }
    }

    export const descriptionValidation = body('description').trim().isLength({min: 3, max: 500}).withMessage("Title length should be from 3 to 500 symbols");
    export const nameValidation = body('name').trim().isLength({min: 3, max: 15}).withMessage("Name length should be from 3 to 15 symbols");
    export const websiteUrlValidation = body('websiteUrl').trim().isLength({min: 3, max: 100}).withMessage("WebsiteUrl should be from 3 to 100 symbols").isURL().withMessage('Неверный формат URL');

    export const titleValidation = body('name').trim().isLength({min: 3, max: 15}).withMessage("Title length should be from 3 to 30 symbols");
    export const shortDescriptionValidation = body('shortDescription').trim().isLength({min: 3, max: 100}).withMessage("Title length should be from 3 to 100 symbols");
    export const contentValidation = body('content').trim().isLength({min: 3, max: 1000}).withMessage("Content length should be from 3 to 1000 symbols");
