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
     
    async updateRefreshToken(userId: string, iat: string | null, exp: string | null, iatNewRefreshToken: string | null, expNewRefreshToken: string | null) {
const result = await devicesCollection.updateOne({
    userId: userId, 
    iatISO: iat,
    expISO: exp
}, {
    $set: {iatISO: iatNewRefreshToken, 
        expISO: expNewRefreshToken,
    }
}
)
return result.modifiedCount === 1
    }
}