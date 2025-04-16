
import { CommentsRepository } from "../Repository/commentsRepository";



export class CommentsService  {
   
    constructor(private commentsRepository : CommentsRepository) {
        
    }

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
        return this.commentsRepository.createComment(newComment)
    }

    async deleteCommentById(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(id)
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(id, content)
    }

}