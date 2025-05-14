import { ObjectId } from "mongodb"

export type LikeStatusDBType = {
    userId: ObjectId
    commentId: ObjectId
    status: string
}