import { BlogViewModel } from "../types/BlogsViewModel";
import { PostViewModel } from "../types/PostsViewModel";
import { blogs } from "./blogsRepository";
import { blogsCollection, postsCollection } from "./db";

export async function clearPostsData() {
    await postsCollection.deleteMany({})
}

export const postsRepository = {

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        blogId?: string,
    ): Promise<any> {
        const filter = blogId ? { blogId } : {}
        return postsCollection.find(filter, { projection: { _id: 0 } })
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
    },
    async getPostsCount(filter: {} = {}): Promise<number> {
        return postsCollection.countDocuments(filter)
    },
   
    async findPostById(id: string): Promise<PostViewModel | null> {
        let post: PostViewModel | null = await postsCollection.findOne({ id: id }, { projection: { _id: 0 } })
        if (post) {
            return post
        } else {
            return null
        }
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {

        const blog = await blogsCollection.findOne({ id: blogId })
        if (blog) {

            const newPost = {
                id: (Date.now() + Math.random()).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: blog.name,
                createdAt: (new Date()).toISOString()
            };
            const result = await postsCollection.insertOne(newPost);
            const foundNewPost = await postsCollection.findOne({ _id: result.insertedId }, { projection: { _id: 0 } })
            return foundNewPost;
        } else {
            return null;
        }
    },

    async updatePost(id: string, title: string, shortDescription: string,
        content: string, blogId: string): Promise<boolean> {
        const result = await postsCollection.updateOne({ id: id }, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
            }
        })
        return result.matchedCount === 1;
    },

    async deletePostById(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({ id: id })
        return result.deletedCount === 1
    }
}