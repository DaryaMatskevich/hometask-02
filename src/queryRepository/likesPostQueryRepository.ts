import { ObjectId } from "mongodb";
import { LikeStatusForPostModel} from "../Repository/db";
import { isValidObjectId } from "mongoose";


export class LikesPostQueryRepository {

    async getLikeStatusByUserId(userId: string, postId: string): Promise<string |  null> {
        if (!isValidObjectId(userId) || !isValidObjectId(postId)) {
    return null;
}
        
        const likeStatus = await LikeStatusForPostModel.findOne({
            userId: new ObjectId(userId),
            postId: new ObjectId(postId)
        }).lean()
        return likeStatus?.status || null;
    }
}