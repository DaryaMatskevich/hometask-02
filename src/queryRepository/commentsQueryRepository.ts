import { ObjectId } from "mongodb";
import { CommentModel} from "../Repository/db"
import { CommentViewType, PaginatedComments } from "../types/CommentTypes/commentType";


export class CommentsQueryRepository  {

    async getCommentsByPostId(postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
    ): Promise<PaginatedComments> {
        const comments = await CommentModel.find({ postId: postId }).sort(
            { [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

        const mappedComments: CommentViewType[] = comments.map(comment => ({
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
                myStatus: comment.likesInfo.myStatus
            }
        }));
        const commentsCount = await CommentModel.countDocuments({ postId: postId })

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
                    myStatus: comment.likesInfo.myStatus
                }

            }
        }
        else {
            return null
        }

        
    }

    async increaseLikes(userIdAsObjectId: ObjectId, commentIdAsObjectId: ObjectId, likeStatus: string) {
        const updatedDoc = await CommentModel.findOneAndUpdate(
            { _id: commentIdAsObjectId },           // критерий поиска
            { $inc: { likesCount: 1 }, myStatus: likeStatus },   // увеличение поля likes на 1
            { new: true }             // вернуть обновлённый документ
          );
      
          return updatedDoc;
        }

        async increaseDisLikes(userIdAsObjectId: ObjectId, commentIdAsObjectId: ObjectId, likeStatus: string) {
            const updatedDoc = await CommentModel.findOneAndUpdate(
                { _id: commentIdAsObjectId, userId: userIdAsObjectId },           // критерий поиска
                { $inc: { dislikesCount: 1 }, myStatus: likeStatus },   // увеличение поля likes на 1
                { new: true }             // вернуть обновлённый документ
              );
          
              return updatedDoc;
            }
    


    async dicreaseLikes(userIdAsObjectId: ObjectId, commentIdAsObjectId: ObjectId, likeStatus: string) {
        const updatedDoc = await CommentModel.findOneAndUpdate(
            {_id: commentIdAsObjectId, userId: userIdAsObjectId },           // критерий поиска
            { $inc: { likesCount: -1 }, myStatus: likeStatus },   // увеличение поля likes на 1
            { new: true }             // вернуть обновлённый документ
          );
      
          return updatedDoc;
        }

        async dicreaseDislikes(userIdAsObjectId: ObjectId, commentIdAsObjectId: ObjectId, likeStatus: string) {
            const updatedDoc = await CommentModel.findOneAndUpdate(
                { _id: commentIdAsObjectId, userId: userIdAsObjectId  },           // критерий поиска
                { $inc: { dislikesCount: -1 }, myStatus: likeStatus},   // увеличение поля likes на 1
                { new: true }             // вернуть обновлённый документ
              );
          
              return updatedDoc;
            }
    }



