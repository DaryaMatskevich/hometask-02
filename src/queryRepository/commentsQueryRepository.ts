import { ObjectId } from "mongodb";
import { commentsCollection } from "../Repository/db"


export const commentsQueryRepository = {
    async getCommentsByPostId(postId: string) {
        const comments = await commentsCollection.find({ postId: new Object(postId) }).toArray()
        return comments.map(comment => ({
            id: comment._id.toString(), // Преобразуем ObjectId в строку
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
        }));
    },
    async getCommentById(id: ObjectId) {
        let comment: any = await commentsCollection.findOne({ _id: id })
        if (comment) {
            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.userId,
                    userLogin: comment.login
                },
                createdAt: comment.createdAt
            }
        }
        else {
            return null
        }
    }
}

