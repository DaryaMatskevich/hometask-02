import { BlogViewModel } from "../types/BlogsViewModel";
import { PostViewModel } from "../types/PostsViewModel";
import { blogs } from "./blogsRepository";
import { blogsCollection, postsCollection } from "./db";

export let posts: PostViewModel[] = []

export async function clearPostsData() {
    await postsCollection.deleteMany({})
}

export const postsRepository = {

    async findPosts(): Promise<PostViewModel[]> {
        return postsCollection.find({}, {projection:{_id:0}}).toArray();
    },

    async findPostById(id: string): Promise<PostViewModel | null> {
        let post: PostViewModel | null = await postsCollection.findOne({ id: id }, {projection:{_id:0}})
        if (post) {
            return post
        } else {
            return null
        }
    },

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | null> {

        const blog: BlogViewModel | null = await blogsCollection.findOne({ id: blogId })
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
            const foundNewPost = await postsCollection.findOne({_id: result.insertedId}, {projection:{_id:0}})
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