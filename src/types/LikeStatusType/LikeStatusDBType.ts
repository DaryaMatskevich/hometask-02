import { ObjectId } from "mongodb"

export type LikeStatusDBType = {
    status: string
    userId: ObjectId
    commentId: ObjectId
}