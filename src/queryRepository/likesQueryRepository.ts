import { ObjectId } from "mongodb";
import { LikeStatusModel } from "../Repository/db";


export class LikesQueryRepository {

    async getLikeStatusByUserId(userId: string, commentId: string): Promise<string |  null> {
        const likeStatus = await LikeStatusModel.findOne({
            userId: new ObjectId(userId),
            commentId: new ObjectId(commentId)
        }).lean()
        return likeStatus && likeStatus.status ? likeStatus.status : null;
    }
}