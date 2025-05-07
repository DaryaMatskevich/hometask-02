import { ObjectId } from "mongodb";
import { LikeStatusModel } from "../Repository/db";


export class LikesQueryRepository {

    async getLikeStatusByUserId(userIdAsObjectId: ObjectId, commentIdAsObjectId: ObjectId) {
        const likeStatus = await LikeStatusModel.findOne({
            userId: userIdAsObjectId,
            commentId: commentIdAsObjectId
        }).lean()
        return likeStatus ? likeStatus.status : null;
    }
}