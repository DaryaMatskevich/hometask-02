import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { securityDevicesRepository } from "../Repository/securityDevicesRepository";

export const securityDevicesServise = {
async createSecurityDevice(userId: ObjectId, deviceId: ObjectId, 
    ip: string, title: string, refreshToken: string) {

const decoded = jwt.decode(refreshToken) as JwtPayload | null;

const exp = decoded?.exp;
const iat = decoded?.iat

const newSecurityDevice = {
    userId,
    deviceId,
    iat,
    title,
    ip,
    exp
}
const createSecurityDevice = await securityDevicesRepository.createsecurityDevice(newSecurityDevice)
},
 
async deleteAllSecurityDevicesExcludeCurrent(userId: string, deviceId: string) {
const result = await securityDevicesRepository.deleteAllSecurityDevicsExcludeCurrent(userId, deviceId)
}, 

async deleteSecurityDeviceById(userId: string, deviceId: string ) {
const result = await securityDevicesRepository.deleteSecurityDeviceById(userId, deviceId)
}
}