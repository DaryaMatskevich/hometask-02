import { ObjectId } from "mongodb"
import { devicesCollection } from "./db"
import { SecurityDeviceInputType } from "../types/SecurityDeviceTypes.ts/SecurityDeviceTypes"

export const securityDevicesRepository = {
    async createsecurityDevice(securityDevice: SecurityDeviceInputType): Promise<string | null> {
const result = await devicesCollection.insertOne({...securityDevice})
if(result) {
    return result.insertedId.toString()
} else {return null}
},

    async deleteSecurityDeviceById(deviceId: string): Promise<boolean> {
const result = await devicesCollection.deleteOne({
    
    deviceId: new ObjectId(deviceId)
})
return result.deletedCount === 1;
    },

    async deleteAllSecurityDevicsExcludeCurrent(userId: string, deviceId: string): Promise<boolean> {
        const result = await devicesCollection.deleteMany(
            {userId: new ObjectId(userId),
                deviceId: {$ne: new ObjectId(deviceId)}
            }
        )
        return result.deletedCount > 0;
    },
     
    async updateRefreshToken(userId: string, deviceId: string, iatISOnew: string | null, expISOnew: string | null): Promise<boolean> {
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