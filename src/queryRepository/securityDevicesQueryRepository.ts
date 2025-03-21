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
   
    async findSecurityDeviceByDeviceId(deviceId: string) {
        if (!ObjectId.isValid(deviceId)) {
            return null}
        const device = await devicesCollection.findOne({
    deviceId: new ObjectId(deviceId)})
     if(!device) return null;
 
        return {
            userId: device.userId,
            deviceId: device.deviceId,
            ip: device.ip,
            lastActiveDate: device.iatISO,
            title: device.title
        }
    },
    async findSecurityDevicesByIat(userId: string, deviceId: string, iatISO: string | null) {
        const result = await devicesCollection.findOne({userId: new ObjectId(userId),
            deviceId: new ObjectId(deviceId), 
            iatISO: iatISO})
        return result
        }
}