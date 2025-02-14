import { ObjectId } from "mongodb";
import { usersCollection } from "../Repository/db";
import { UserDBType } from "../types/UserTypes/UserDBType";
import { UserAuthType } from "../types/UserTypes/UserAuthType";

export const usersQueryRepository = {
    async findUsers(
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        searchLoginTerm: string | null,
        searchEmailTerm: string | null
    ): Promise<any> {
        const filter: any = {}
        if (searchLoginTerm || searchEmailTerm) {
            filter.$or = [];
            if (searchLoginTerm) {
                filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
            }
            if (searchEmailTerm) {
                filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
            }
        }
        const users = await usersCollection.find(filter).sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        const mappedUsers = users.map(user => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }))
        const usersCount: any = await usersCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(usersCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: usersCount,
            items: mappedUsers
        }

    },




    async findUserById(id: string) {
        let user: any | null = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (user) {
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }
        } else {
            return null
        }
    },
    async findUserByLoginOrEmailforAuth(loginOrEmail: string) {
        return await usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        })

    },

    async findUserByIdforAuth(id: string): Promise<UserAuthType | null> {
        let user: UserDBType | null = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (user) {
            return{
                login: user.login,
                userId: user._id.toString(),
            }
        } else {
            return null
        }
    },

}