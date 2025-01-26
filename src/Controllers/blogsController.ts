import { Request, Response, Router } from "express";
import { blogsRepository } from "../Repository/blogsRepository";
import { descriptionValidation, inputValidationMiddleware, nameValidation, websiteUrlValidation } from "../Middlewares/middlewares";
import { body } from "express-validator";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { blogsCollection } from "../Repository/db";


export const blogsRouter = Router({})


blogsRouter.get('/', async (req: Request, res: Response) => {
  const foundBlogs = await blogsRepository.findAllBlogs()
  res.status(200).send(foundBlogs)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  let blog = await blogsRepository.findBlogById(req.params.id)
  if (blog) {
    res.status(200).send(blog)
  }
  else { res.sendStatus(404) }
})

blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { name, description, websiteUrl } = req.body;
  const newBlog = await blogsRepository.createBlog(name, description, websiteUrl)
  const newBlogResult = blogsCollection.findOne({_id: newBlog})
if(newBlog) {
  res.status(201).send(newBlog)}
})

blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { name, description, websiteUrl } = req.body;
  let isUpdated = await blogsRepository.updateBlog(req.params.id, name, description, websiteUrl)
  if (isUpdated) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
}
)

blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const isDeleted = await blogsRepository.deleteBlog(req.params.id)
  if (isDeleted) {
    res.sendStatus(204)
  }
  res.sendStatus(404)
})



