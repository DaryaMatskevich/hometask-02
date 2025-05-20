import { ObjectId } from "mongodb";
import { CommentModel, LikeStatusModel } from "../Repository/db"
import { CommentViewType, PaginatedComments } from "../types/CommentTypes/commentType";


export class CommentsQueryRepository {

    async getCommentsByPostId(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        userId?: string,
        
    ): Promise<PaginatedComments> {
        const comments = await CommentModel.find({ postId: postId }).sort(
            { [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

            let userLikeStatuses: Record<string, string> = {};
            
            if (userId) {
                const commentIds = comments.map(c => c._id);
                const userLikes = await LikeStatusModel.find({
                    userId: new ObjectId(userId),
                    commentId: { $in: commentIds }
                }).lean();
        
                userLikes.forEach(like => {
                    userLikeStatuses[like.commentId.toString()] = like.status;
                });
            }

        const mappedComments: CommentViewType[] = comments.map(comment => {
            const likeStatus = userId ? userLikeStatuses[comment._id.toString()] || 'None' : 'None';
        return {
            id: comment._id.toString(), // Преобразуем ObjectId в строку
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: likeStatus
            }
        }});
        const commentsCount = await CommentModel.countDocuments({ postId: postId })

        return {
            pagesCount: Math.ceil(commentsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: commentsCount,
            items: mappedComments
        }

    }

    async getCommentById(id: string, likeStatus?: string | null): Promise<CommentViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }

        const comment: any | null = await CommentModel.findOne({ _id: new ObjectId(id) })
        if (comment) {
            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount,
                    myStatus: likeStatus || 'None'
                }

            }
        }
        else {
            return null
        }
    }
}



