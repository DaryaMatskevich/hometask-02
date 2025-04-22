
import { BlogDBType, FilterOptions } from "../types/BlogTypes/BlogTypes";
import { BlogModel } from "./db";


export async function clearBlogsData() {
  await BlogModel.deleteMany({})
}

export class BlogsRepository {

  async findAllBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    searchNameTerm: string | null

  ): Promise<BlogDBType[]> {
    const filter: FilterOptions = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    return BlogModel.find(filter, { projection: { _id: 0 } }).sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize).lean()
      
  }

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
    const filter: FilterOptions = {}
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' }
    }
    return BlogModel.countDocuments(filter)
  }

  async findBlogById(id: string): Promise<BlogDBType | null> {
    let blog: BlogDBType | null = await BlogModel.findOne({ id: id }, { projection: { _id: 0 } });
    if (blog) {
      return blog
    } else {
      return null
    }
  }

  async createBlog(newBlog: BlogDBType): Promise<BlogDBType | null> {

    const result = await BlogModel.create(newBlog);
    const foundNewBlog = await BlogModel.findOne({ _id: result._id }, { projection: { _id: 0 } })
    return foundNewBlog
  }

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    const result = await BlogModel.updateOne({ id: id }, {
      $set: {
        name: name,
        description: description,
        websiteUrl: websiteUrl
      }
    })
    return result.matchedCount === 1
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ id: id })
    return result.deletedCount === 1
  }
}

