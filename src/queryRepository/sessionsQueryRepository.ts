import { ObjectId } from "mongodb"
import { SessionModel } from "../Repository/db"
import { SessionType, SessionViewType, SessionDBType } from "../types/SessionsTypes.ts/SessionsTypes"
import { injectable } from "inversify"
@injectable()
export class SessionsQueryRepository {

    async findSessions(userId: string): Promise<SessionViewType[]> {
        const result = await SessionModel.find({userId: new ObjectId(userId)}).lean()
        return result.map(device => ({
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iatISO,
            title: device.title
           
            
        }))
    }
   
    async findSessionByDeviceId(deviceId: string): Promise<SessionType | null> {
        if (!ObjectId.isValid(deviceId)) {
            return null}
        const device = await SessionModel.findOne({
    deviceId: new ObjectId(deviceId)})
     if(!device) return null;
 
        return {
            userId: device.userId,
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iatISO,
            title: device.title
        }
    }
    async findSessionByIat(userId: string, deviceId: string, iatISO: string | null): Promise<SessionDBType | null> {
        const result = await SessionModel.findOne({userId: new ObjectId(userId),
            deviceId: new ObjectId(deviceId), 
            iatISO: iatISO})
        return result
        }
}