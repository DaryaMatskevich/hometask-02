import { Collection, MongoClient, ObjectId } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogDBType } from "../types/BlogTypes/BlogTypes";
import { PostDBType } from "../types/PostTypes/PostDBType";
import * as dotenv from 'dotenv'
import mongoose from "mongoose";
import { WithId } from 'mongodb'
import { CommentDBType } from "../types/CommentTypes/commentType";
import { UserDBType } from "../types/UserTypes/UserDBType";
import { SessionDBType } from "../types/SessionsTypes.ts/SessionsTypes";
import { ApiRequestCountType } from "../types/RequestCount.ts/RequestCountType";
import { LikeStatusDBType } from "../types/LikeStatusType/LikeStatusDBType";
import { LikeStatusForPostDBType } from "../types/LikeStatusForPost/LikeStatusForPostDBType";



dotenv.config()


export const BlogSchema = new mongoose.Schema<WithId<BlogDBType>>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true }
})

export const PostSchema = new mongoose.Schema<WithId<PostDBType>>({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: true },
    createdAt: { type: String, required: true },
    extendedLikesInfo: {
        likesCount: { type: Number, default: 0 },
        dislikesCount: { type: Number, default: 0 },
        newestLikes: {  type: Array, default: [] }
    }
})

export const CommentSchema = new mongoose.Schema<WithId<CommentDBType>>({
    postId: { type: String, required: true },
    content: { type: String, required: true },
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true }
    },
    createdAt: { type: String, required: true },
    likesInfo: {
        likesCount: { type: Number, default: 0 },
        dislikesCount: { type: Number, default: 0 },

    }
})

export const UserSchema = new mongoose.Schema<WithId<UserDBType>>({
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    recoveryCodeExpirationDate: { type: Date, require: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true }
})

export const SessionSchema = new mongoose.Schema<WithId<SessionDBType>>({
    userId: { type: ObjectId, required: true },
    deviceId: { type: ObjectId, required: true },
    iatISO: { type: String, required: true },
    title: { type: String, required: true },
    ip: { type: String, required: true },
    expISO: { type: String, required: true },
})

export const ApiRequestCountSchema = new mongoose.Schema<WithId<ApiRequestCountType>>({
    IP: { type: String },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
})

export const LikeStatusSchema = new mongoose.Schema<WithId<LikeStatusDBType>>({
    userId: { type: ObjectId, required: true },
    commentId: { type: ObjectId, required: true },
    status: { type: String, required: true },
})

export const LikeStatusforPostSchema = new mongoose.Schema<WithId<LikeStatusForPostDBType>>({
    userId: { type: ObjectId, required: true },
    postId: { type: ObjectId, required: true },
    status: { type: String, required: true },
    userLogin: { type: String, required: true },
    addedAt: { type: String, required: true },
})



export const BlogModel = mongoose.model<WithId<BlogDBType>>('blogs', BlogSchema)
export const PostModel = mongoose.model<WithId<PostDBType>>('posts', PostSchema)
export const CommentModel = mongoose.model<WithId<CommentDBType>>('comments', CommentSchema)
export const UserModel = mongoose.model<WithId<UserDBType>>('users', UserSchema)
export const SessionModel = mongoose.model<WithId<SessionDBType>>('sessions', SessionSchema)
export const ApiRequestCountModel = mongoose.model<WithId<ApiRequestCountType>>('apiRequestCount', ApiRequestCountSchema)
export const LikeStatusModel = mongoose.model<WithId<LikeStatusDBType>>('likesStatus', LikeStatusSchema)
export const LikeStatusForPostModel = mongoose.model<WithId<LikeStatusForPostDBType>>('likeStatusForPost', LikeStatusforPostSchema)



// export let blogsCollection: Collection<BlogViewType>
// export let postsCollection: Collection<PostViewType>
// export let usersCollection: Collection<any>
// export let commentsCollection: Collection<any>
// export let devicesCollection: Collection<any>
// export let apiRequestCountCollection: Collection<any>

export async function runDb() {

    try {

        await mongoose.connect(SETTINGS.MONGO_URL)
        console.log("Connected successfully to mongo server")


    } catch (e) {
        console.log("no connection")
        await mongoose.disconnect()

    }
}
