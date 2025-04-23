import { ObjectId } from "mongodb"

export type SessionViewType = {
    deviceId: ObjectId
    ip: string
    lastActiveDate: string
    title: string
}

export type SessionType = {
    userId: ObjectId,
    deviceId: ObjectId,
    ip: string
    lastActiveDate: string
    title: string
}

export type SessionDBType = {
        userId: ObjectId
        deviceId: ObjectId
        iatISO: string 
        title: string
        ip: string
        expISO: string
    }

 