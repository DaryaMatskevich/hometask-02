import { ObjectId } from "mongodb";
import { LikeStatusForPostModel } from "./db";

export class LikesPostRepository {

    async createStatus(userId: string,
        postId: string, 
        likeStatus: string,
        login: string
    ) {
        const result = await LikeStatusForPostModel.create({
            userId: new ObjectId(userId),
            postId: new ObjectId(postId),
            status: likeStatus,
            userLogin: login,
            addedAt: (new Date()).toISOString()
        }
        )
        if(result) {
        return true} else return false
    }

    async setStatus(userId: string,
        postId: string,
        likeStatus: string,
        login: string
    ) {
        const result = await LikeStatusForPostModel.updateOne({
            userId: new ObjectId(userId),
            postId: new ObjectId(postId),
            userLogin: login
        
        },
            {
                $set: { status: likeStatus,
                    addedAt: (new Date()).toISOString()
                 }
            }).exec()
        return result.matchedCount>0}

}