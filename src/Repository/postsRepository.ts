
import { ObjectId } from "mongodb";
import { PostDBType, PostViewType } from "../types/PostTypes/PostDBType";
import { LikeStatusForPostModel, PostModel } from "./db";

export async function clearPostsData() {
    await PostModel.deleteMany({})
}

export class PostsRepository {

    async findPosts(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        filter: {},
        userId?: string
    ): Promise<PostViewType[] | any> {

        const posts = await PostModel.find(filter)
            .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean();

const userStatuses = userId 
            ? await LikeStatusForPostModel.find({
                userId: new ObjectId(userId),
                postId: { $in: posts.map(p => p._id) }
            }).lean()
            : [];

        const statusMap = new Map(
            userStatuses.map(status => [
                status.postId.toString(), 
                status.status
            ])
        );
          const newestLikes = await LikeStatusForPostModel.aggregate([
            { $match: { 
                postId: { $in: posts.map(p => p._id) },
                status: 'Like'
            }},
            { $sort: { addedAt: -1 } },
            { $group: {
                _id: "$postId",
                likes: { $push: {
                    userId: "$userId",
                    login: "$userLogin",
                    addedAt: "$addedAt"
                }},
                count: { $sum: 1 }
            }},
            { $project: {
                postId: "$_id",
                newestLikes: { $slice: ["$likes", 3] },
                likesCount: "$count"
            }}
        ]);

        const likesMap = new Map(
            newestLikes.map(item => [
                item.postId.toString(),
                {
                    newestLikes: item.newestLikes,
                    likesCount: item.likesCount
                }
            ])
        );
             const items = posts.map(post => {
            const postIdStr = post._id.toString();
            const likesInfo = likesMap.get(postIdStr) || {
                newestLikes: [],
                likesCount: 0
            };

            return {
                id: postIdStr,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likesInfo.likesCount,
                    dislikesCount: post.extendedLikesInfo?.dislikesCount || 0,
                    myStatus: userId ? statusMap.get(postIdStr) || 'None' : 'None',
                    newestLikes: likesInfo.newestLikes
                }
            };
        });
return items

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