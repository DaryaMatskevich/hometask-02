import { ObjectId } from "mongodb";
import { LikeStatusModel } from "./db";

export class LikesRepository {

    async createStatus(userId: string,
        commentId: string, likeStatus: string
    ) {
        const result = await LikeStatusModel.create({
            userId: new ObjectId(userId),
            commentId: new ObjectId(commentId),
            status: likeStatus
        }
        )
        return !!result
    }

    async setStatus(userId: string,
        commentId: string,
        likeStatus: string
    ) {
        const result = await LikeStatusModel.updateOne({
            userId: new ObjectId(userId),
            commentId: new ObjectId(commentId)
        },
            {
                $set: { status: likeStatus }
            }).exec()
        return !!result
    }

}