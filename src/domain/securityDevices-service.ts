import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { SecurityDevicesRepository } from "../Repository/securityDevicesRepository";
import { SecurityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityDevicesServiсe {

    constructor(
        @inject(SecurityDevicesRepository) private securityDevicesRepository: SecurityDevicesRepository,
        @inject (SecurityDevicesQueryRepository) private securityDevicesQueryRepository: SecurityDevicesQueryRepository
    ) {
    }
    async createSecurityDevice(userId: ObjectId, deviceId: ObjectId,
        ip: string, title: string, refreshToken: string): Promise<string | null> {

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
        const createSecurityDevice = await this.securityDevicesRepository.createsecurityDevice(newSecurityDevice)

        return createSecurityDevice;
    }

    async deleteAllSecurityDevicesExcludeCurrent(userId: string, deviceId: string): Promise<boolean> {
        const result = await this.securityDevicesRepository.deleteAllSecurityDevicsExcludeCurrent(userId, deviceId)
        return result
    }

    async deleteSecurityDeviceById(deviceId: string): Promise<boolean> {
        const result = await this.securityDevicesRepository.deleteSecurityDeviceById(deviceId)
        return result
    }

    async updateRefreshToken(userId: string, deviceId: string, refreshToken: string): Promise<boolean> {

        const decodedNewRefreshToken = jwt.decode(refreshToken) as JwtPayload | null;

        if (!decodedNewRefreshToken || typeof decodedNewRefreshToken.exp !== 'number' || typeof decodedNewRefreshToken.iat !== 'number') {
            throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
        }
        const expNewRefreshToken = decodedNewRefreshToken.exp;
        const iatNewRefreshToken = decodedNewRefreshToken.iat

        const expISOnew = expNewRefreshToken ? new Date(expNewRefreshToken * 1000).toISOString() : null;
        const iatISOnew = iatNewRefreshToken ? new Date(iatNewRefreshToken * 1000).toISOString() : null;


        const result = await this.securityDevicesRepository.updateRefreshToken(userId, deviceId, iatISOnew, expISOnew)
        return result;
    }

    async checkRefreshToken(userId: string, deviceId: string, refreshToken: string): Promise<boolean> {
        const decoded = jwt.decode(refreshToken) as JwtPayload | null;

        if (!decoded || typeof decoded.exp !== 'number' || typeof decoded.iat !== 'number') {
            throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
        }


        const iat = decoded.iat


        const iatISO = iat ? new Date(iat * 1000).toISOString() : null;

        const checkIat = await this.securityDevicesQueryRepository.findSecurityDevicesByIat(userId, deviceId, iatISO)
        if (!checkIat) {
            return false
        } else {
            return true
        }
    }
}