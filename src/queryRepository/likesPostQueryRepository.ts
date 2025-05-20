import { ObjectId } from "mongodb";
import { LikeStatusForPostModel} from "../Repository/db";


export class LikesPostQueryRepository {

    async getLikeStatusByUserId(userId: string, postId: string): Promise<string |  null> {
        const likeStatus = await LikeStatusForPostModel.findOne({
            userId: new ObjectId(userId),
            postId: new ObjectId(postId)
        }).lean()
        return likeStatus && likeStatus.status ? likeStatus.status : null;
    }
}