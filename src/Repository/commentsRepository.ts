import { ObjectId } from "mongodb"
import { CommentModel } from "./db"
import { CommentInputType } from "../types/CommentTypes/commentType"

export async function clearCommentsData() {
    await CommentModel.deleteMany({})
}

export class CommentsRepository  {

    async createComment (comment: CommentInputType): Promise<string>{
        const newComment = await CommentModel.insertOne(comment)
return newComment._id.toString()
    }

    async deleteCommentById (id: string): Promise<boolean> {
const result = await CommentModel.deleteOne({_id: new ObjectId(id)})
return result.deletedCount === 1
    }

    async updateComment (id: string, content: string): Promise<boolean> {
const result = await CommentModel.updateOne({_id: new ObjectId(id)}, {
    $set: {
        content: content
    }
})
return result.matchedCount === 1
    }
}