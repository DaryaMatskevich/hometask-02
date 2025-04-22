import { WithId } from "mongodb";
import { PostDBType } from "../types/PostTypes/PostDBType";
import { PostModel } from "./db";

export async function clearPostsData() {
    await PostModel.deleteMany({})
}

export class PostsRepository {

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        filter: {},
    ): Promise<PostDBType[]> {

        return PostModel.find(filter, { projection: { _id: 0 } })
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();
    }

    async getPostsCount(filter: {}): Promise<number> {
        return PostModel.countDocuments(filter)
    }

    async findPostById(id: string): Promise<PostDBType | null> {
        let post: PostDBType | null = await PostModel.findOne({ id: id }, { projection: { _id: 0 } })
        if (post) {
            return post
        } else {
            return null
        }
    }

    async createPost(post: PostDBType): Promise<string | null>{

        const result = await PostModel.create(post);
        return result.id
           } 


async updatePost(id: string, title: string, shortDescription: string,
    content: string, blogId: string): Promise < boolean > {
        const result = await PostModel.updateOne({ id: id }, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
            }
        })
        return result.matchedCount === 1;
    }

    async deletePostById(id: string): Promise < boolean > {
    const result = await PostModel.deleteOne({ id: id })
        return result.deletedCount === 1
}
}