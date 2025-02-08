import { ObjectId } from "mongodb"
import { usersCollection } from "./db"

export const usersRepository = {
    async createUser(user: any): Promise<string> {
        const newUser = await usersCollection.insertOne({ ...user })
        return newUser.insertedId.toString()
    },
    
    async findUserByLoginOrEmail(login: string, email: string) {
        return await usersCollection.findOne({
            $or: [{ login: login }, { email: email }]
        })

    },

    async findUserById(id: string): Promise<any | null> {
        let user: any | null = await usersCollection.findOne({ _id: new ObjectId(id) })
        if (user) {
            return user
        } else {
            return null
        }
    },

    async deleteUserById(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1

    }
}