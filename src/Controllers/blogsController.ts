import { Request, Response, Router } from "express";
import { blogsRepository } from "../Repository/blogsRepository";
import { descriptionValidation, inputValidationMiddleware, nameValidation, websiteUrlValidation } from "../Middlewares/middlewares";
import { body } from "express-validator";
import { authMiddleware } from "../Middlewares/authMiddleware";


export const blogsRouter = Router({})


blogsRouter.get('/', (req: Request, res: Response) => {
  const foundBlogs = blogsRepository.findAllBlogs()
  res.status(200).send(foundBlogs)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
  let blog = blogsRepository.findBlogById(req.params.id)
  if (blog) {
    res.status(200).send(blog)
  }
  else { res.sendStatus(404) }
})

blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, (req: Request, res: Response) => {
  const { name, description, websiteUrl } = req.body;
  const newBlog = blogsRepository.createBlog(name, description, websiteUrl)
if(newBlog) {
  res.status(201).send(newBlog)}
})

blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, (req: Request, res: Response) => {
  const { name, description, websiteUrl } = req.body;
  let isUpdated = blogsRepository.updateBlog(req.params.id, name, description, websiteUrl)
  if (isUpdated) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
}
)

blogsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  const isDeleted = blogsRepository.deleteBlog(req.params.id)
  if (isDeleted) {
    res.send(204)
  }
  res.send(404)
})



