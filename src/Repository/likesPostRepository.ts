import { ObjectId } from "mongodb";
import { LikeStatusForPostModel } from "./db";

export class LikesPostRepository {

    async createStatus(userId: string,
        postId: string, likeStatus: string
    ) {
        const result = await LikeStatusForPostModel.create({
            userId: new ObjectId(userId),
            postId: new ObjectId(postId),
            status: likeStatus
        }
        )
        return !!result
    }

    async setStatus(userId: string,
        postId: string,
        likeStatus: string
    ) {
        const result = await LikeStatusForPostModel.updateOne({
            userId: new ObjectId(userId),
            postId: new ObjectId(postId)
        },
            {
                $set: { status: likeStatus }
            }).exec()
        return !!result
    }

}