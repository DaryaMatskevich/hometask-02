
import { ObjectId } from "mongodb";
import { BlogViewModel } from "../types/BlogsViewModel";
import { blogsCollection } from "./db";

export let blogs: BlogViewModel[] = []
   
export async function clearBlogsData() {
  await blogsCollection.deleteMany({})
}

export const blogsRepository = {

  async findAllBlogs(): Promise<BlogViewModel[]> {
    return blogsCollection.find({}).toArray();
  },

  async findBlogById(id: string): Promise<BlogViewModel | null> {
    let blog: BlogViewModel | null = await blogsCollection.findOne({ id: id });
    if (blog) {
      return blog
    } else {
      return null
    }
},

  async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel>  {
    const newBlog = {
      id: (Date.now() + Math.random()).toString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: (new Date()).toISOString(),
      isMembership: false
    }
    const result = await blogsCollection.insertOne(newBlog);
           return newBlog
      },

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise < boolean > {
     const result =  await blogsCollection.updateOne({id:id}, {$set:{
        name : name,
        description : description,
        websiteUrl : websiteUrl
      }})
    return result.matchedCount === 1
    },

      async deleteBlog(id: string): Promise < boolean > {
        const result = await blogsCollection.deleteOne({id:id})
        return result.deletedCount === 1
  }
}

