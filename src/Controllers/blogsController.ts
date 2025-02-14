import { Request, Response, Router } from "express";
import { blogsService } from "../domain/blogs-service";
import { contentValidation, descriptionValidation, inputValidationMiddleware, nameValidation, shortDescriptionValidation, titleValidation, websiteUrlValidation } from "../Middlewares/middlewares";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { SortDirection } from "mongodb";
import { postsService } from "../domain/posts-service";
import {blogIdExistenseMiddleware } from "../Middlewares/middlewares"


export const blogsRouter = Router({})


blogsRouter.get('/', async (req: Request, res: Response) => {
  let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
  let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
  let sortDirection: SortDirection =
    req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
      ? 'asc'
      : 'desc'

  let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

  const foundBlogs = await blogsService.findAllBlogs(
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    searchNameTerm
  )
  res.status(200).send(foundBlogs)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
  let blog = await blogsService.findBlogById(req.params.id)
  if (blog) {
    res.status(200).send(blog)
  }
  else { res.sendStatus(404) }
})

blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { name, description, websiteUrl } = req.body;
  const newBlog = await blogsService.createBlog(name, description, websiteUrl)
  if (newBlog) {
    res.status(201).send(newBlog)
  }
})

blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
  const { name, description, websiteUrl } = req.body;
  let isUpdated = await blogsService.updateBlog(req.params.id, name, description, websiteUrl)
  if (isUpdated) {
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})


blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  const isDeleted = await blogsService.deleteBlog(req.params.id)
  if (isDeleted) {
    res.sendStatus(204)
  }
  res.sendStatus(404)
})


blogsRouter.post('/:id/posts', authMiddleware, blogIdExistenseMiddleware, titleValidation,
  shortDescriptionValidation, contentValidation, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blogId = req.params.id;
    
    const { title, shortDescription, content } = req.body;
    const newPost = await postsService.createPost(title, shortDescription, content, blogId);
    res.status(201).send(newPost)
  })


blogsRouter.get('/:id/posts', blogIdExistenseMiddleware, async (req: Request, res: Response) => {
  const blogId = req.params.id;

  let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
  let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
  let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
  let sortDirection: SortDirection =
    req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
      ? 'asc'
      : 'desc'

  const foundPostsForSpesificBlog = await postsService.findPosts(
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
    blogId
  )
  res.status(200).send(foundPostsForSpesificBlog)

})