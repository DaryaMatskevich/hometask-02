import { ObjectId } from "mongodb"
import { devicesCollection } from "../Repository/db"

export const securityDevicesQueryRepository = {
    async findSecurityDevices(userId: string) {
        const result = await devicesCollection.find({userId: new ObjectId(userId)}).toArray()
        return result.map(device=> ({
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iat,
            title: device.title
           
            
        }))
    }
}