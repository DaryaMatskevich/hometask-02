import { ObjectId } from "mongodb";
import { commentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { commentsRepository } from "../Repository/commentsRepository";



export const commentsService = {
    async sendComment(comment: string, userId: string) {

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
    },

    async deleteCommentById(id: string) : Promise <boolean> {
const comment = await commentsQueryRepository.getCommentById(id)
    if (!comment) return false
    return await commentsRepository.deleteCommentById(id)
},

async updateComment(id: string, content: string) : Promise <boolean> {
return await commentsRepository.updateComment(id, content)
}

}