import { devicesCollection } from "../Repository/db"

export const securityDevicesQueryRepository = {
    async findSecurityDevices() {
        const result = await devicesCollection.find().toArray()
        return result
    }
}