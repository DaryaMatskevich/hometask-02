import { ObjectId } from "mongodb";
import { LikeStatusModel } from "./db";

export class LikesRepository {

    async createStatus(userIdAsObjectId: ObjectId,
        commentIdAsObjectId: ObjectId, likeStatus: string
    ) {
        const result = await LikeStatusModel.create({
            userId: userIdAsObjectId,
            commentId: commentIdAsObjectId,
            status: likeStatus
        }
        )
        return !!result
    }

    async setNoneStatus(userIdAsObjectId: ObjectId,
        commentIdAsObjectId: ObjectId,
    ) {
        const result = await LikeStatusModel.updateOne({
            userId: userIdAsObjectId,
            commentId: commentIdAsObjectId
        },
            {
                $set: { status: 'None' }
            }
        ).exec()
        return !!result
    }

    async setLikeStatus(userIdAsObjectId: ObjectId,
        commentIdAsObjectId: ObjectId,
    ) {
        const result = await LikeStatusModel.updateOne({
            userId: userIdAsObjectId,
            commentId: commentIdAsObjectId
        },
            {
                $set: { status: 'Like' }
            }
        ).exec()
        return !!result
    }

    async setDislikeStatus(userIdAsObjectId: ObjectId,
        commentIdAsObjectId: ObjectId,
    ) {
        const result = await LikeStatusModel.updateOne({
            userId: userIdAsObjectId,
            commentId: commentIdAsObjectId
        },
            {
                $set: { status: 'Dislike' }
            }).exec()
        return !!result
    }

}