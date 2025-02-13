import { commentsCollection } from "./db"

export const commentsRepository = {
    async createComment (comment: any){
        const newComment = await commentsCollection.insertOne({...comment})
return newComment.insertedId
    },
}