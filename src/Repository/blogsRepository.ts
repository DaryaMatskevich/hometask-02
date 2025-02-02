
import { ObjectId } from "mongodb";
import { BlogViewModel } from "../types/BlogsViewModel";
import { blogsCollection } from "./db";

export let blogs: BlogViewModel[] = []
   
export async function clearBlogsData() {
  await blogsCollection.deleteMany({})
}

export const blogsRepository = {

  async findAllBlogs(
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 'asc'|'desc',
    searchNameTerm: string | null

  ): Promise<any> {
    const filter:any = {}
    if(searchNameTerm) {
      filter.title = {$regex: searchNameTerm, $options: '1', projection:{_id:0}}
    }
    return blogsCollection.find(filter).sort({[sortBy]: sortDirection === 'asc'? 1: -1})
    .skip((pageNumber-1)* pageSize)
    .limit(pageSize)
    .toArray();
  },

  async getBlogsCount(searchNameTerm: string | null): Promise<number> {
const filter: any = {}
if (searchNameTerm) {
  filter.title = {$regex: {searchNameTerm}, $options: '1'}
}
return blogsCollection.countDocuments(filter)
  },

  async findBlogById(id: string): Promise<any | null> {
    let blog: BlogViewModel | null = await blogsCollection.findOne({ id: id },{projection:{_id:0}});
    if (blog) {
      return blog
    } else {
      return null
    }
},

  async createBlog(newBlog: any): Promise<any>  {
    
    const result = await blogsCollection.insertOne(newBlog);
    const foundNewBlog = await blogsCollection.findOne({ _id: result.insertedId },{projection:{_id:0}})
           return foundNewBlog
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

