import { ObjectId } from "mongodb"

export type SecurityDeviceViewType = {
    deviceId: string
    ip: string
    lastActiveDate: string
    title: string
}

export type SecurityDeviceDBType = {
    _id: ObjectId
    userId: string
    deviceId: string
    ip: string
    lastActiveDate: string
    title: string
}

export type SecurityDeviceInputType = {
        userId: ObjectId
        deviceId: ObjectId
        iatISO: string | null
        title: string
        ip: string
        expISO: string | null
    }

    export type SecurityDeviceType = {
        userId: ObjectId
        deviceId: ObjectId
        ip: string
        lastActiveDate: string
        title: string
    }