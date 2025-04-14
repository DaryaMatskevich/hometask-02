import { ObjectId } from "mongodb"
import { commentsCollection } from "./db"
import { CommentInputType } from "../types/CommentTypes/commentType"

export async function clearCommentsData() {
    await commentsCollection.deleteMany({})
}

export class CommentsRepository  {

    async createComment (comment: CommentInputType): Promise<string>{
        const newComment = await commentsCollection.insertOne(comment)
return newComment.insertedId.toString()
    }

    async deleteCommentById (id: string): Promise<boolean> {
const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
return result.deletedCount === 1
    }

    async updateComment (id: string, content: string): Promise<boolean> {
const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {
    $set: {
        content: content
    }
})
return result.matchedCount === 1
    }
}