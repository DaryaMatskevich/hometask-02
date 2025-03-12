import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { securityDevicesRepository } from "../Repository/securityDevicesRepository";

export const securityDevicesServise = {
async createSecurityDevice(userId: ObjectId, deviceId: ObjectId, 
    ip: string, deviceName: string, refreshToken: string) {

const decoded = jwt.decode(refreshToken) as JwtPayload | null;

const exp = decoded?.exp;
const iat = decoded?.iat

const newSecurityDevice = {
    userId,
    deviceId,
    iat,
    deviceName,
    ip,
    exp
}
const createSecurityDevice = await securityDevicesRepository.createsecurityDevice(newSecurityDevice)
},
 
async deleteAllSecurityDevicesExcludeCurrent() {

}, 

async deleteSecurityDeviceById() {

}
}