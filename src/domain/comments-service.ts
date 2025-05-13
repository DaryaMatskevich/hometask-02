

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
        private likesQueryRepository: LikesQueryRepository
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
                dislikesCount: 0
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
        const comment = await this.commentsQueryRepository.getCommentById(commentId, likeStatus)
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

        const currentStatus = await this.likesQueryRepository.getLikeStatusByUserId(userId, commentId)

        if (likeStatus === currentStatus) {
            return {
                status: ResultStatus.Success,
                data: true,
                extensions: []
            }
        } 
// Обновляем счетчики в комментарии
if (currentStatus === 'Like') {
    await this.commentsRepository.decreaseLikes(commentId)
} else if (currentStatus === 'Dislike') {
    await this.commentsRepository.decreaseDislikes(commentId)
}

if (likeStatus === 'Like') {
    await this.commentsRepository.increaseLikes(commentId)
} else if (likeStatus === 'Dislike') {
    await this.commentsRepository.increaseDisLikes(commentId)
}

   
    let result: boolean;
    
    if (currentStatus === null) { 
        result = await this.likesRepository.createStatus(
            userId, 
            commentId, 
            likeStatus
        );
    } else  {
        result = await this.likesRepository.setStatus(
            userId,
            commentId,
            likeStatus
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

async getCommentById(commentId: string) {
const comment = await this.commentsQueryRepository.getCommentById(commentId)
if (!comment) {
    return null 
}
else {
    return comment
}
    }

    async getCommentByIdforAuth(userId: string, commentId: string) {

        
        const currentStatus = await this.likesQueryRepository.getLikeStatusByUserId(userId, commentId)

        const comment = await this.commentsQueryRepository.getCommentById(commentId, currentStatus)
        if (!comment) {
            return null 
        }
        else {
            return comment
        }
            }
}
