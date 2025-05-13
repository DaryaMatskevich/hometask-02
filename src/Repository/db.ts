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



dotenv.config()


export const BlogSchema = new mongoose.Schema<WithId<BlogDBType>>({
    id: { type: String, require: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    websiteUrl: { type: String, require: true },
    createdAt: { type: String, require: true },
    isMembership: { type: Boolean, require: true }
})

export const PostSchema = new mongoose.Schema<WithId<PostDBType>>({
    id: { type: String, require: true },
    title: { type: String, require: true },
    shortDescription: { type: String, require: true },
    content: { type: String, require: true },
    blogId: { type: String, require: true },
    blogName: { type: String, require: true },
    createdAt: { type: String, require: true }
})

export const CommentSchema = new mongoose.Schema<WithId<CommentDBType>>({
    postId: { type: String, require: true },
    content: { type: String, require: true },
    commentatorInfo: {
        userId: { type: String, require: true },
        userLogin: { type: String, require: true }
    },
    createdAt: { type: String, require: true },
    likesInfo: {
        likesCount: { type: Number, default: 0 },
        dislikesCount: { type: Number, default: 0 },
        // myStatus: { type: String, default: 'None' }
    }
})

export const UserSchema = new mongoose.Schema<WithId<UserDBType>>({
    login: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    createdAt: { type: String, require: true },
    confirmationCode: { type: String, require: true },
    recoveryCodeExpirationDate: { type: Date, require: true },
    expirationDate: { type: Date, require: true },
    isConfirmed: { type: Boolean, require: true }
})

export const SessionSchema = new mongoose.Schema<WithId<SessionDBType>>({
    userId: { type: ObjectId, require: true },
    deviceId: { type: ObjectId, require: true },
    iatISO: { type: String, require: true },
    title: { type: String, require: true },
    ip: { type: String, require: true },
    expISO: { type: String, require: true },
})

export const ApiRequestCountSchema = new mongoose.Schema<WithId<ApiRequestCountType>>({
    IP: { type: String },
    URL: { type: String, require: true },
    date: { type: Date, require: true },
})

export const LikeStatusSchema = new mongoose.Schema<WithId<LikeStatusDBType>>({
    userId: { type: ObjectId, require: true },
    commentId: { type: ObjectId, require: true },
    status: { type: String, require: true },
})



export const BlogModel = mongoose.model<WithId<BlogDBType>>('blogs', BlogSchema)
export const PostModel = mongoose.model<WithId<PostDBType>>('posts', PostSchema)
export const CommentModel = mongoose.model<WithId<CommentDBType>>('comments', CommentSchema)
export const UserModel = mongoose.model<WithId<UserDBType>>('users', UserSchema)
export const SessionModel = mongoose.model<WithId<SessionDBType>>('sessions', SessionSchema)
export const ApiRequestCountModel = mongoose.model<WithId<ApiRequestCountType>>('apiRequestCount', ApiRequestCountSchema)
export const LikeStatusModel = mongoose.model<WithId<LikeStatusDBType>>('likesStatus', LikeStatusSchema)


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
