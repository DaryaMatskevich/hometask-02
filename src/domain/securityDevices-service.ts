import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { securityDevicesRepository } from "../Repository/securityDevicesRepository";


export const securityDevicesServise = {
async createSecurityDevice(userId: ObjectId, deviceId: ObjectId, 
    ip: string, title: string, refreshToken: string) {

const decoded = jwt.decode(refreshToken) as JwtPayload | null;

const exp = decoded?.exp;
const iat = decoded?.iat

const expISO = exp ? new Date(exp * 1000).toISOString() : null;
const iatISO = iat ? new Date(iat * 1000).toISOString() : null;


const newSecurityDevice = {
    userId,
    deviceId,
    iatISO,
    title,
    ip,
    expISO
}
const createSecurityDevice = await securityDevicesRepository.createsecurityDevice(newSecurityDevice)
},
 
async deleteAllSecurityDevicesExcludeCurrent(userId: string, deviceId: string) {
return await securityDevicesRepository.deleteAllSecurityDevicsExcludeCurrent(userId, deviceId)
}, 

async deleteSecurityDeviceById(deviceId: string ) {
return await securityDevicesRepository.deleteSecurityDeviceById(deviceId)
},
 async updateRefreshToken(userId: string, refreshToken: string, newRefreshToken: string) {
    const decoded = jwt.decode(refreshToken) as JwtPayload | null;

    if (!decoded || typeof decoded.exp !== 'number' || typeof decoded.iat !== 'number') {
        throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
    }

const exp = decoded.exp;
const iat = decoded.iat

const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload | null;

    if (!decodedRefreshToken || typeof decodedRefreshToken.exp !== 'number' || typeof decodedRefreshToken.iat !== 'number') {
        throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
    }
    const expRefreshToken = decoded.exp;
    const iatRefreshToken = decoded.iat
const result = await securityDevicesRepository.updateRefreshToken(userId, iat, exp, iatRefreshToken, expRefreshToken)
return result;
}
}