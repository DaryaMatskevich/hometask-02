import { ObjectId } from "mongodb"
import { devicesCollection } from "../Repository/db"

export const securityDevicesQueryRepository = {
    async findSecurityDevices(userId: string) {
        const result = await devicesCollection.find({userId: new ObjectId(userId)}).toArray()
        return result.map(device=> ({
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.iat,
            deviceId: device.deviceId
        }))
    }
}