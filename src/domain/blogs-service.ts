import { BlogsRepository} from "../Repository/blogsRepository";
import { BlogViewType, PaginatedResponse } from "../types/BlogTypes/BlogTypes";



export class BlogsService  {

  private blogsRepository: BlogsRepository
  
  constructor(){
    this.blogsRepository = new BlogsRepository()

  }

  async findAllBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: "asc" | "desc",
    searchNameTerm: string | null
  ): Promise<PaginatedResponse<BlogViewType>> {
    const blogs = await this.blogsRepository.findAllBlogs(
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchNameTerm
    )
    const blogsCount = await this.blogsRepository.getBlogsCount(searchNameTerm)

    return {
      pagesCount: Math.ceil(blogsCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: blogsCount,
      items: blogs
    }
  }

  async findBlogById(id: string): Promise<BlogViewType | null> {
    return this.blogsRepository.findBlogById(id)
  }

  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewType | null> {
    const newBlog = {
      id: (Date.now() + Math.random()).toString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: (new Date()).toISOString(),
      isMembership: false
    }
    const createdBlog = await this.blogsRepository.createBlog(newBlog)

    return createdBlog
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    return await this.blogsRepository.updateBlog(id, name, description, websiteUrl)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id)
  }
}
