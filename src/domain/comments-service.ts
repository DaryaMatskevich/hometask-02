import { ObjectId } from "mongodb";
import { commentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { commentsRepository } from "../Repository/commentsRepository";



export const commentsService = {

    async createComment(postId: string, content: string, userLogin: string, userId: string): Promise<string> {

        const newComment = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt: new Date().toISOString()
        }
        return commentsRepository.createComment(newComment)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id)
    },

    async updateComment(id: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    }

}