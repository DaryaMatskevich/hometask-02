import { devicesCollection } from "./db"

export const securityDevicesRepository = {
    async createsecurityDevice(securityDevice: any) {
const newSecurityDevice = await devicesCollection.insertOne({...securityDevice})
    return newSecurityDevice
},

    async deleteSecurityDeviceById() {
const result = await devicesCollection.deleteOne()
    },

    async deleteAllSecurityDevicsExcludeCurrent() {
        const result = await devicesCollection.deleteMany()
    }
}