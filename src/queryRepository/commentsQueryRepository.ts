import { ObjectId } from "mongodb";
import { commentsCollection } from "../Repository/db"
import { CommentViewType, PaginatedComments } from "../types/CommentTypes/commentType";


export class CommentsQueryRepository  {

    async getCommentsByPostId(postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
    ): Promise<PaginatedComments> {
        const comments = await commentsCollection.find({ postId: postId }).sort(
            { [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const mappedComments: CommentViewType[] = comments.map(comment => ({
            id: comment._id.toString(), // Преобразуем ObjectId в строку
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
        }));
        const commentsCount = await commentsCollection.countDocuments({ postId: postId })

        return {
            pagesCount: Math.ceil(commentsCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: commentsCount,
            items: mappedComments
        }

    }

    async getCommentById(id: string): Promise<CommentViewType | null> {
        if (!ObjectId.isValid(id)) {
            return null;
        }

        const comment: any | null = await commentsCollection.findOne({ _id: new ObjectId(id) })
        if (comment) {
            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt
            }
        }
        else {
            return null
        }
    }
}

