import { Request, Response } from "express";
import { BlogsService } from "../domain/blogs-service";
import { SortDirection } from "mongodb";
import { PostsService } from "../domain/posts-service";





export class BlogsController {

  constructor(private blogsService: BlogsService,
    private postsService: PostsService) {

  }

  async getBlogs(req: Request, res: Response) {
    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection =
      req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
        ? 'asc'
        : 'desc'

    let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm.toString() : null

    const foundBlogs = await this.blogsService.findAllBlogs(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm
    )
    res.status(200).send(foundBlogs)
  }

  async getBlogById(req: Request, res: Response) {
    let blog = await this.blogsService.findBlogById(req.params.id)
    if (blog) {
      res.status(200).send(blog)
    }
    else { res.sendStatus(404) }
  }

  async createBlog(req: Request, res: Response) {
    const { name, description, websiteUrl } = req.body;
    const newBlog = await this.blogsService.createBlog(name, description, websiteUrl)
    if (newBlog) {
      res.status(201).send(newBlog)
    }
  }

  async updateBlogById(req: Request, res: Response) {
    const { name, description, websiteUrl } = req.body;
    let isUpdated = await this.blogsService.updateBlog(req.params.id, name, description, websiteUrl)
    if (isUpdated) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  }


  async deleteBlogById(req: Request, res: Response) {
    const isDeleted = await this.blogsService.deleteBlog(req.params.id)
    if (isDeleted) {
      res.sendStatus(204)
    }
    res.sendStatus(404)
  }

  async createPostforBlog(req: Request, res: Response) {
    const blogId = req.params.id;

    const { title, shortDescription, content } = req.body;
    const newPost = await this.postsService.createPost(title, shortDescription, content, blogId);
    res.status(201).send(newPost)
  }

  async getPostsForBlog(req: Request, res: Response) {
    const blogId = req.params.id;

    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection =
      req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
        ? 'asc'
        : 'desc'

    const foundPostsForSpesificBlog = await this.postsService.findPosts(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      blogId
    )
    res.status(200).send(foundPostsForSpesificBlog)

  }
}

