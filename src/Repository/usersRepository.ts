import "reflect-metadata"
import { ObjectId } from "mongodb"
import { UserModel } from "./db"
import { injectable } from "inversify"

export async function clearUsersData() {
    await UserModel.deleteMany({})
}
@injectable()
export class UsersRepository {

    async createUser(user: any): Promise<string> {
        const newUser = await UserModel.insertOne({ ...user })
        return newUser._id.toString()
    }

    async findUserByLoginOrEmail(login: string, email: string) {
        return await UserModel.findOne({
            $or: [{ login: login }, { email: email }]
        })

    }

    async findUserById(id: string): Promise<any | null> {
        if (!this._checkObjectId(id)) return null;
        return UserModel.findOne({ _id: new ObjectId(id) })

    }

    async deleteUserById(id: string): Promise<boolean> {
        if (!this._checkObjectId(id)) return false;
        const result = await UserModel.deleteOne({ _id: new ObjectId(id) })
        return result.deletedCount === 1
    }

    _checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }

    async updateConfirmation(_id: ObjectId) {
        let result = await UserModel.updateOne(
            { _id },
            { $set: { 'isConfirmed': true } }
        )
        return result.modifiedCount === 1
    }

    async updateUserConfirmationCode(_id: ObjectId, newConfirmationCode: string,
        newExpirationDate: Date): Promise<boolean> {
        let result = await UserModel.updateOne(
            { _id },
            {
                $set:
                {
                    confirmationCode: newConfirmationCode,
                    expirationDate: newExpirationDate
                }
            }
        )
        return result.modifiedCount === 1
    }

    async saveRecoveryCode(userId: ObjectId, recoveryCode: string, recoveryCodeExpirationDate: Date): Promise<boolean> {
        let result = await UserModel.updateOne(
            { _id: userId },
            {
                $set: {
                    recoveryCode: recoveryCode,
                    recoveryCodeExpirationDate: recoveryCodeExpirationDate,
                },
            }
        )
        return result.modifiedCount > 0
    }

    async updatePassword(userId: ObjectId, newPassword: string): Promise<boolean> {
        let result = await UserModel.updateOne(
            { _id: userId },
            {
                $set:
                {
                    password: newPassword,
                    recoveryCode: null,
                    recoveryCodeExpirationDate: null
                }
            }
        )
        return result.modifiedCount === 1
    }
}

