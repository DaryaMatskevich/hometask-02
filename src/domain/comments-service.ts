
import { ObjectId } from "mongodb";
import { CommentsRepository } from "../Repository/commentsRepository";
import { LikesRepository } from "../Repository/likesRepository";
import { LikesQueryRepository } from "../queryRepository/likesQueryRepository";
import { CommentsQueryRepository } from "../queryRepository/commentsQueryRepository";
import { ResultStatus } from "../types/result/resultCode";
import { Result } from "../types/result/result.type";



export class CommentsService {

    constructor(private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
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
    ): Promise<Result<boolean>> {
        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                data: false,
                errorMessage: 'Comment not found',
                extensions: [{
                    field: 'likeStatus',
                    message: 'Comment not found'
                }]
            }
        }

        if (!['Like', 'Dislike', 'None'].includes(likeStatus)) {
            return {
                status: ResultStatus.BadRequest,
                data: false,
                errorMessage: 'Invalid like status',
                extensions: [{
                    message: 'Status must be Like, Dislike or None',
                    field: 'likeStatus',
                    
                }]
            };
        }

        const userIdAsObjectId = new ObjectId(userId)
        const commentIdAsObjectId = new ObjectId(commentId)
        const currentStatus = await this.LikesQueryRepository.getLikeStatusByUserId(userIdAsObjectId, commentIdAsObjectId)


        if (likeStatus === currentStatus) {
            return {
                status: ResultStatus.Success,
                data: true,
                extensions: []
            }
        } 

        if(currentStatus === null || likeStatus === "Like") {
            const result = await this.commentsQueryRepository.increaseLikes(commentIdAsObjectId)
        }

        if(currentStatus ===  null || likeStatus === "Dislike") {
            const result = await this.commentsQueryRepository.increaseDisLikes(commentIdAsObjectId)
        }

        if(currentStatus ===  "None" || likeStatus === "Like") {
            const result = await this.commentsQueryRepository.increaseLikes(commentIdAsObjectId)
        }

        if(currentStatus ===  "None" || likeStatus === "Dislike") {
            const result = await this.commentsQueryRepository.increaseDisLikes(commentIdAsObjectId)
        }

        
        if(currentStatus ===  "Like" || likeStatus === "Dislike") {
            const result2 = await this.commentsQueryRepository.dicreaseLikes(commentIdAsObjectId)
            const result = await this.commentsQueryRepository.increaseLikes(commentIdAsObjectId)
        }

        
        if(currentStatus ===  "Dislike" || likeStatus === "Like") {
            const result2 = await this.commentsQueryRepository.dicreaseDislikes(commentIdAsObjectId)
            const result = await this.commentsQueryRepository.increaseLikes(commentIdAsObjectId)
        }

        if(currentStatus ===  "Dislike" || likeStatus === "None") {
            const result = await this.commentsQueryRepository.dicreaseDislikes(commentIdAsObjectId)
        }

        if(currentStatus ===  "Like" || likeStatus === "None") {
            const result = await this.commentsQueryRepository.dicreaseLikes(commentIdAsObjectId)
        }

   
    let result: boolean;
    
    if (currentStatus === null) { 
        result = await this.likesRepository.createStatus(
            userIdAsObjectId, 
            commentIdAsObjectId, 
            likeStatus
        );
    } else if (likeStatus === 'None') {
        result = await this.likesRepository.setNoneStatus(
            userIdAsObjectId, 
            commentIdAsObjectId
        );
    } else if (likeStatus === 'Like') {
        result = await this.likesRepository.setLikeStatus(
            userIdAsObjectId, 
            commentIdAsObjectId
        );
    } else {
        result = await this.likesRepository.setDislikeStatus(
            userIdAsObjectId, 
            commentIdAsObjectId
        );
    }

    if (!result) {
        return {
            status: ResultStatus.BadRequest,
            data: false,
            errorMessage: `Failed to update status to ${likeStatus}`,
            extensions: []
        };
    }

    return {
        status: ResultStatus.Success,
        data: true,
        extensions: []
    };
}
    }
