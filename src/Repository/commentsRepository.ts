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

    async increaseLikes(commentId: string):Promise<boolean> {
        const updatedDoc = await CommentModel.updateOne(
            { _id: new ObjectId(commentId)},           // критерий поиска
            { $inc: { 'likesInfo.likesCount': 1 }},   // увеличение поля likes на 1
                      // вернуть обновлённый документ
          );
      
          return updatedDoc.modifiedCount>0;
        }

        async increaseDisLikes(commentId: string) :Promise<boolean>{
            const updatedDoc = await CommentModel.updateOne(
                { _id: new ObjectId(commentId)},           // критерий поиска
                { $inc: { 'likesInfo.dislikesCount': 1 } },   // увеличение поля likes на 1
                           // вернуть обновлённый документ
              );
          
              return updatedDoc.modifiedCount>0;
            }
    


    async decreaseLikes(commentId: string):Promise<boolean> {
        const updatedDoc = await CommentModel.updateOne(
            {_id: new ObjectId(commentId) },           // критерий поиска
            { $inc: { 'likesInfo.likesCount': -1 }},   // увеличение поля likes на 1
                       // вернуть обновлённый документ
          );
      
          return updatedDoc.modifiedCount>0;
        }

        async decreaseDislikes(commentId: string):Promise<boolean> {
            const updatedDoc = await CommentModel.updateOne(
                { _id: new ObjectId(commentId)},           // критерий поиска
                { $inc: { 'likesInfo.dislikesCount': -1 }},   // увеличение поля likes на 1
                          // вернуть обновлённый документ
              );
          
              return updatedDoc.modifiedCount>0;
            }
}
