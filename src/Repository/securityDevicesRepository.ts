import { ObjectId } from "mongodb"
import { devicesCollection } from "./db"

export const securityDevicesRepository = {
    async createsecurityDevice(securityDevice: any) {
const newSecurityDevice = await devicesCollection.insertOne({...securityDevice})
    return newSecurityDevice
},

    async deleteSecurityDeviceById(userId: string, deviceId: string) {
const result = await devicesCollection.deleteOne({
    userId: new ObjectId(userId),
    deviceId: new ObjectId(deviceId)
})
return result.deletedCount === 1;
    },

    async deleteAllSecurityDevicsExcludeCurrent(userId: string, deviceId: string) {
        const result = await devicesCollection.deleteMany(
            {userId: new ObjectId(userId),
                deviceId: {$ne: new ObjectId(deviceId)}
            }
        )
        return result.deletedCount === 1;
    }
}