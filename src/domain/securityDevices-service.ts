import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { securityDevicesRepository } from "../Repository/securityDevicesRepository";
import { securityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";


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
return createSecurityDevice;
},
 
async deleteAllSecurityDevicesExcludeCurrent(userId: string, deviceId: string) {
const result = await securityDevicesRepository.deleteAllSecurityDevicsExcludeCurrent(userId, deviceId)
return result
}, 

async deleteSecurityDeviceById(deviceId: string ) {
const result = await securityDevicesRepository.deleteSecurityDeviceById(deviceId)
return result
},
 async updateRefreshToken(userId: string, refreshToken: string, newRefreshToken: string) {
    
    const decoded = jwt.decode(refreshToken) as JwtPayload | null;

    if (!decoded || typeof decoded.exp !== 'number' || typeof decoded.iat !== 'number') {
        throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
    }

const exp = decoded.exp;
const iat = decoded.iat

const expISO = exp ? new Date(exp * 1000).toISOString() : null;
const iatISO = iat ? new Date(iat * 1000).toISOString() : null;

const checkIat = await securityDevicesQueryRepository.findSecurityDevicesByIat(iatISO)
if(!checkIat) {
    return false
}
const decodedNewRefreshToken = jwt.decode(newRefreshToken) as JwtPayload | null;

    if (!decodedNewRefreshToken || typeof decodedNewRefreshToken.exp !== 'number' || typeof decodedNewRefreshToken.iat !== 'number') {
        throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
    }
    const expNewRefreshToken = decoded.exp;
    const iatNewRefreshToken = decoded.iat

    const expISOnew = exp ? new Date(exp * 1000).toISOString() : null;
    const iatISOnew = iat ? new Date(iat * 1000).toISOString() : null;

const result = await securityDevicesRepository.updateRefreshToken(userId, iatISO, expISO, iatISOnew, expISOnew)
return result;
}
}