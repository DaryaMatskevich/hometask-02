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
            return usersCollection.find(filter).sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
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