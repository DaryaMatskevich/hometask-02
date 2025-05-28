
import { ObjectId } from "mongodb";
// import { PostViewType, LikeStatus } from "../types/PostTypes/PostDBType";
import { LikeStatusForPostModel, PostModel } from "./db";
import {LikeStatus, PostViewType} from "../types/PostTypes/PostDBType";

export async function clearPostsData() {
    await PostModel.deleteMany({})
}


interface AggregationLikeItem {
    addedAt: String;
    userId: ObjectId;  // или другой тип, в зависимости от вашей БД
    userLogin: string;
}

export class PostsRepository {

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        filter: {},
        userId?: string
    ): Promise<any> {


try {
            // 1. Получаем посты с пагинацией
            const posts = await PostModel.find(filter)
                .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();

            if (posts.length === 0) {
                return [];
            }

            const postIds = posts.map(p => p._id);

           // 2. Получаем статусы текущего пользователя для этих постов
        const userStatuses = userId 
            ? await LikeStatusForPostModel.find({
                userId: new ObjectId(userId),
                postId: { $in: postIds }
            }).lean()
            : [];

        // 3. Создаем мапу статусов пользователя {postId: status}
        
        const userStatusMap = new Map(
            userStatuses.map(status => [
                status.postId.toString(), 
                status.status
            ])
        );

        // 4. Получаем агрегированные данные о лайках
        const [likesAggregation, dislikesAggregation] = await Promise.all([
            LikeStatusForPostModel.aggregate([
                { 
                    $match: { 
                        postId: { $in: postIds }, 
                        status: LikeStatus.Like 
                    } 
                },
                { $sort: { addedAt: -1 } },
                {
                    $group: {
                        _id: "$postId",
                        likesCount: { $sum: 1 },
                        newestLikes: {
                            $push: {
                                addedAt: "$addedAt",
                                userId: "$userId",
                                userLogin: "$userLogin"
                            }
                        }
                    }
                },
                {
                    $project: {
                        likesCount: 1,
                        newestLikes: { $slice: ["$newestLikes", 3] }
                    }
                }
            ]),
            LikeStatusForPostModel.aggregate([
                { 
                    $match: { 
                        postId: { $in: postIds }, 
                        status: LikeStatus.Dislike 
                    } 
                },
                {
                    $group: {
                        _id: "$postId",
                        dislikesCount: { $sum: 1 }
                    }
                }
            ])
        ]);

        // 5. Создаем мапы для быстрого доступа
        const likesMap = new Map(
            likesAggregation.map(item => [
                item._id.toString(),
                {
                    likesCount: item.likesCount,
                    newestLikes: item.newestLikes.map((like:AggregationLikeItem) => ({
                        addedAt: like.addedAt,
                        userId: like.userId.toString(),
                        login: like.userLogin
                    }))
                }
            ])
        );

        const dislikesMap = new Map(
            dislikesAggregation.map(item => [
                item._id.toString(),
                item.dislikesCount
            ])
        );

        // 6. Формируем финальный результат
        return posts.map(post => {
            const postId = post._id.toString();
            const likesData = likesMap.get(postId) || { 
                likesCount: 0, 
                newestLikes: [] 
            };
            const dislikesCount = dislikesMap.get(postId) || 0;
            
            // Определяем myStatus для текущего пользователя
            const myStatus = userId 
                ? (userStatusMap.get(postId) || LikeStatus.None)
                : LikeStatus.None;

            return {
                id: postId,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likesData.likesCount,
                    dislikesCount: dislikesCount,
                    myStatus: myStatus,
                    newestLikes: likesData.newestLikes
                }
            };
        });

    } catch (error) {
        console.error('Ошибка в findPosts:', error);
        throw new Error('Не удалось получить посты');
    }
}



    async getPostsCount(filter: {}): Promise<number> {
        return PostModel.countDocuments(filter)
    }

    async getPostById(id: string, likeStatus?: string | null): Promise<any | null> {
      if(!ObjectId.isValid(id)) return null;
        const post = await PostModel.findOne({ _id: new ObjectId(id) }).lean()

        if (!post) return null;

        const newestLikes = (post.extendedLikesInfo?.newestLikes || [])
            .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
            .slice(0, 3)
            .map(like => ({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login
            }
            ))

        if (post) {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.extendedLikesInfo.likesCount ?? 0,
                    dislikesCount: post.extendedLikesInfo.dislikesCount ?? 0,
                    myStatus: likeStatus ?? 'None',
                    newestLikes: newestLikes

                }
            }
        }
    }

    async createPost(post: any): Promise<string | null> {

        const result = await PostModel.create(post);
        if (result) {
            return result._id.toString()
        }
        else { return null }
    }


    async updatePost(id: string, title: string, shortDescription: string,
        content: string, blogId: string): Promise<boolean> {
        const result = await PostModel.updateOne({ _id: new ObjectId(id) }, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
            }
        })
        return result.matchedCount === 1;
    }

    async deletePostById(id: string): Promise<boolean> {
        const result = await PostModel.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }


    async increaseLikes(postId: string): Promise<boolean> {
        const updatedDoc = await PostModel.updateOne(
            { _id: new ObjectId(postId) },           // критерий поиска
            { $inc: { 'extendedLikesInfo.likesCount': 1 } },   // увеличение поля likes на 1
            // вернуть обновлённый документ
        );

        return updatedDoc.modifiedCount > 0;
    }

    async increaseDisLikes(postId: string): Promise<boolean> {
        const updatedDoc = await PostModel.updateOne(
            { _id: new ObjectId(postId) },           // критерий поиска
            { $inc: { 'extendedLikesInfo.dislikesCount': 1 } },   // увеличение поля likes на 1
            // вернуть обновлённый документ
        );

        return updatedDoc.modifiedCount > 0;
    }


    async decreaseLikes(postId: string): Promise<boolean> {
        const updatedDoc = await PostModel.updateOne(
            { _id: new ObjectId(postId) },           // критерий поиска
            { $inc: { 'extendedLikesInfo.likesCount': -1 } },   // увеличение поля likes на 1
            // вернуть обновлённый документ
        );

        return updatedDoc.modifiedCount > 0;
    }

    async decreaseDislikes(postId: string): Promise<boolean> {
        const updatedDoc = await PostModel.updateOne(
            { _id: new ObjectId(postId) },           // критерий поиска
            { $inc: { 'extendedLikesInfo.dislikesCount': -1 } },   // увеличение поля likes на 1
            // вернуть обновлённый документ
        );

        return updatedDoc.modifiedCount > 0;
    }

    async updateNewestLikes(postId: string, userId: string, login: string, likeStatus: string): Promise<void> {
        if (likeStatus === 'Like') {
            await PostModel.updateOne(
                { _id: new ObjectId(postId) },
                {
                    $pull: {
                        'extendedLikesInfo.newestLikes': { userId } // удаляем старый лайк юзера, если есть
                    }
                }
            );

            await PostModel.updateOne(
                { _id: new ObjectId(postId) },
                {
                    $push: {
                        'extendedLikesInfo.newestLikes': {
                            $each: [{
                                addedAt: new Date().toISOString(),
                                userId,
                                login
                            }],
                            $position: 0, // добавляем в начало
                            $slice: 3     // ограничиваем тремя элементами
                        }
                    }
                }
            );
        } else {
            // если статус не Like — удаляем пользователя из newestLikes
            await PostModel.updateOne(
                { _id: new ObjectId(postId) },
                {
                    $pull: {
                        'extendedLikesInfo.newestLikes': { userId }
                    }
                }
            );
        }
    }
}