
import { ObjectId } from "mongodb";
import { CommentsRepository } from "../Repository/commentsRepository";
import { LikesRepository } from "../Repository/likesRepository";
import { LikesQueryRepository } from "../queryRepository/likesQueryRepository";



export class CommentsService {

    constructor(private commentsRepository: CommentsRepository,
        private likesRepository: LikesRepository,
        private LikesQueryRepository: LikesQueryRepository
    ) {

    }

    async createComment(postId: string, content: string, userLogin: string, userId: string): Promise<string> {

        const newComment = {
            postId: postId,
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0, 
                myStatus: 'None'
            }
        }
        return this.commentsRepository.createComment(newComment)
    }

    async deleteCommentById(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteCommentById(id)
    }

    async updateComment(id: string, content: string): Promise<boolean> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async changeLikeStatus(userId: string,
        commentId: string,
        likeStatus: string
    ): Promise<boolean | any> {
        const userIdAsObjectId = new ObjectId(userId)
        const commentIdAsObjectId = new ObjectId(commentId)
        const currentStatus = await this.LikesQueryRepository.getLikeStatusByUserId(userIdAsObjectId, commentIdAsObjectId)


        if (likeStatus === currentStatus) {
            return true
        }

        

        if (currentStatus === null && likeStatus === 'None') {
            const result = await this.likesRepository.createStatus(userIdAsObjectId, commentIdAsObjectId, likeStatus)
            return result;
        }

        if (currentStatus === null && likeStatus === 'Like') {
            const result = await this.likesRepository.createStatus(userIdAsObjectId, commentIdAsObjectId, likeStatus)
            return result;
        }

        if (currentStatus === null && likeStatus === 'Dislike') {
            const result = await this.likesRepository.createStatus(userIdAsObjectId, commentIdAsObjectId, likeStatus)
            return result;
        }

        if (likeStatus === 'None' && currentStatus === 'Like') {
            const result = await this.likesRepository.setNoneStatus(userIdAsObjectId, commentIdAsObjectId)
            return result
        }

        if (likeStatus === 'None' && currentStatus === 'Dislike') {
            const result = await this.likesRepository.setNoneStatus(userIdAsObjectId, commentIdAsObjectId)
            return result
        }

        if (likeStatus === 'Like' && currentStatus === 'None') {
            const result = await this.likesRepository.setLikeStatus(userIdAsObjectId, commentIdAsObjectId)
            return result
        }

        if (likeStatus === 'Like' && currentStatus === 'Dislike') {
            const result = await this.likesRepository.setLikeStatus(userIdAsObjectId, commentIdAsObjectId)
            return result
        }

        if (likeStatus === 'Dislike' && currentStatus === 'None') {
            const result = await this.likesRepository.setDislikeStatus(userIdAsObjectId, commentIdAsObjectId)
            return result
        }

        if (likeStatus === 'Dislike' && currentStatus === 'Like') {
            const result = await this.likesRepository.setDislikeStatus(userIdAsObjectId, commentIdAsObjectId)
            return result
        }

         }
}