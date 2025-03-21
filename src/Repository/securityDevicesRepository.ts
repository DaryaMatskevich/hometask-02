import { ObjectId } from "mongodb"
import { devicesCollection } from "./db"

export const securityDevicesRepository = {
    async createsecurityDevice(securityDevice: any) {
const newSecurityDevice = await devicesCollection.insertOne({...securityDevice})
    return newSecurityDevice
},

    async deleteSecurityDeviceById(deviceId: string) {
const result = await devicesCollection.deleteOne({
    
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
        return result.deletedCount > 0;
    },
     
    async updateRefreshToken(userId: string, deviceId: string, iatISOnew: string | null, expISOnew: string | null) {
const result = await devicesCollection.updateOne({
    userId: new ObjectId(userId), 
    deviceId: new ObjectId(deviceId)
   
}, {
    $set: {iatISO: iatISOnew, 
        expISO: expISOnew,
    }
}
)
return result.modifiedCount === 1
    }
}