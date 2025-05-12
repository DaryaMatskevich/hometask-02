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

    async increaseLikes(commentIdAsObjectId: ObjectId):Promise<boolean> {
        const updatedDoc = await CommentModel.updateOne(
            { _id: commentIdAsObjectId},           // критерий поиска
            { $inc: { likesCount: 1 }},   // увеличение поля likes на 1
                      // вернуть обновлённый документ
          );
      
          return updatedDoc.modifiedCount>0;
        }

        async increaseDisLikes(commentIdAsObjectId: ObjectId) :Promise<boolean>{
            const updatedDoc = await CommentModel.updateOne(
                { _id: commentIdAsObjectId},           // критерий поиска
                { $inc: { dislikesCount: 1 } },   // увеличение поля likes на 1
                           // вернуть обновлённый документ
              );
          
              return updatedDoc.modifiedCount>0;
            }
    


    async decreaseLikes(commentIdAsObjectId: ObjectId):Promise<boolean> {
        const updatedDoc = await CommentModel.updateOne(
            {_id: commentIdAsObjectId },           // критерий поиска
            { $inc: { likesCount: -1 }},   // увеличение поля likes на 1
                       // вернуть обновлённый документ
          );
      
          return updatedDoc.modifiedCount>0;
        }

        async decreaseDislikes(commentIdAsObjectId: ObjectId):Promise<boolean> {
            const updatedDoc = await CommentModel.updateOne(
                { _id: commentIdAsObjectId},           // критерий поиска
                { $inc: { dislikesCount: -1 }},   // увеличение поля likes на 1
                          // вернуть обновлённый документ
              );
          
              return updatedDoc.modifiedCount>0;
            }
}