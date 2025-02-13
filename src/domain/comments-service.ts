import { ObjectId } from "mongodb";
import { commentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { commentsRepository } from "../Repository/commentsRepository";



export const commentsService = {
    async sendComment(comment: string, userId: string) {

    },
    async getCommentsById(postId: string) {
        return await commentsQueryRepository.getCommentsByPostId(postId)
    },

    async createComment(postId: string, content: string, login: string, userId: string) {

        const newComment = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: login
            },
            createdAt: new Date().toString()
        }
        return commentsRepository.createComment(newComment)
    }
}