import { ObjectId } from "mongodb"

export type LikeStatusForPostDBType = {
    userId: ObjectId
    postId: ObjectId
    status: string,
    userLogin: string,
    addedAt: string
}