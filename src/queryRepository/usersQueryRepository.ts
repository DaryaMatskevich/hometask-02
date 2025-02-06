import { ObjectId } from "mongodb";
import { usersCollection } from "../Repository/db";

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
        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: 'i' }
            if (searchEmailTerm) {
                filter.email = { $regex: searchEmailTerm, $options: 'i' }
            }
            const result = await usersCollection.find(filter).sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const users = result.map(user => {
                return {
                    id: user._id.toString(),
                    login: user.login,
                    password: user.password,
                    email: user.email,
                    createdAt: user.createdAt
                }

            })
            return users
        }
    },


    async findUserById(id: string) {
        let user: any | null = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (user) {
            user.id = user._id
            delete user._id
            return user
        } else {
            return null
        }

    }
}