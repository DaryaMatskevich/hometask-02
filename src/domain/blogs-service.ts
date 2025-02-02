import { blogsRepository } from "../Repository/blogsRepository";
import { postsRepository } from "../Repository/postsRepository";
import { BlogViewModel } from "../types/BlogsViewModel";
import { PostViewModel } from "../types/PostsViewModel";


export const blogsService = {

  async findAllBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: "asc" | "desc",
    searchNameTerm: string | null
  ): Promise<any> {
    const blogs = await blogsRepository.findAllBlogs(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm
    )
    const blogsCount = await blogsRepository.getBlogsCount(searchNameTerm)

    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: blogsCount,
      items: blogs
    }
  },

  async findBlogById(id: string): Promise<any | null> {
    return blogsRepository.findBlogById(id)
  },

  async createBlog(name: string, description: string, websiteUrl: string): Promise<any> {
    const newBlog = {
      id: (Date.now() + Math.random()).toString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: (new Date()).toISOString(),
      isMembership: false
    }
    const createdBlog = await blogsRepository.createBlog(newBlog)

    return createdBlog
  },

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return await blogsRepository.updateBlog(id, name, description, websiteUrl)
  },

  async deleteBlog(id: string): Promise<boolean> {

    return await blogsRepository.deleteBlog(id)
  },

  async createPostForSpecificBlog(blogId: string, title: string, shortDescription: string,
    content: string): Promise<PostViewModel | null> {
    return await postsRepository.createPost(title, shortDescription, content, blogId)
  },
}
