import { ObjectId } from "mongodb"
import { devicesCollection } from "../Repository/db"

export const securityDevicesQueryRepository = {
    async findSecurityDevices(userId: string) {
        const result = await devicesCollection.find({userId: new ObjectId(userId)}).toArray()
        return result.map(device=> ({
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iatISO,
            title: device.title
           
            
        }))
    },
    async findSecurityDeviceByDeviceIdandUserId(userId: string, deviceId: string) {
        const result = await devicesCollection.find({userId: new ObjectId(userId),
    deviceId: new ObjectId(deviceId)})
        return result.map(device=> ({
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iatISO,
            title: device.title
           
            
        }))
    },
    async findSecurityDeviceByDeviceId(deviceId: string) {
        const device = await devicesCollection.findOne({
    deviceId: new ObjectId(deviceId)})
     if(!device) return null;

        return {
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iatISO,
            title: device.title
        }
    },
    async findSecurityDevicesByIat(iatISO: string | null) {
        const result = await devicesCollection.find({iatISO: iatISO})
        return result
        }
}