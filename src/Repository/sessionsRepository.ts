import { ObjectId } from "mongodb"
import { SessionModel } from "./db"
import { SessionDBType } from "../types/SessionsTypes.ts/SessionsTypes"
import { injectable } from "inversify"
@injectable()
export class SessionsRepository {

    async createSession(session: SessionDBType): Promise<string | null> {
        const result = await SessionModel.insertOne({ ...session })
        if (result) {
            return result._id.toString()
        } else { return null }
    }

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteOne({

            deviceId: new ObjectId(deviceId)
        })
        return result.deletedCount === 1;
    }

    async deleteAllSessionsExcludeCurrent(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionModel.deleteMany(
            {
                userId: new ObjectId(userId),
                deviceId: { $ne: new ObjectId(deviceId) }
            }
        )
        return result.deletedCount > 0;
    }

    async updateRefreshToken(userId: string, deviceId: string, iatISOnew: string | null, expISOnew: string | null): Promise<boolean> {
        const result = await SessionModel.updateOne({
            userId: new ObjectId(userId),
            deviceId: new ObjectId(deviceId)

        }, {
            $set: {
                iatISO: iatISOnew,
                expISO: expISOnew,
            }
        }
        )
        return result.modifiedCount === 1
    }
}