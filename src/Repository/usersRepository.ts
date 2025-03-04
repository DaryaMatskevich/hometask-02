import { ObjectId } from "mongodb"
import { usersCollection } from "./db"

export async function clearUsersData() {
  await usersCollection.deleteMany({})
}

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
        if(!this._checkObjectId(id)) return null;
        return usersCollection.findOne({ _id: new ObjectId(id) })

    },

    async deleteUserById(id: string): Promise<boolean> {
        if (!this._checkObjectId(id)) return false;
        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1

    },
    _checkObjectId(id: string) : boolean {
        return ObjectId.isValid(id)
    },

    async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection.updateOne(
            {_id}, 
            {$set: {'isConfirmed': true}}
        )
        return result.modifiedCount === 1
    },

    async updateUserConfirmationCode(_id: ObjectId, newConfirmationCode: string, 
        newExpirationDate: Date): Promise<boolean> {
        let result = await usersCollection.updateOne(
            {_id}, 
            {$set: 
        {confirmationCode: newConfirmationCode,
        expirationDate: newExpirationDate}}
            )
        return result.modifiedCount === 1
    }
    }
