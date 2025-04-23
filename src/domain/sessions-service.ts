import { ObjectId } from "mongodb"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { SessionsRepository } from "../Repository/sessionsRepository";
import { SessionsQueryRepository } from "../queryRepository/sessionsQueryRepository";
import { inject, injectable } from "inversify";

@injectable()
export class SessionsServiсe {

    constructor(
        @inject(SessionsRepository) private sessionsRepository: SessionsRepository,
        @inject(SessionsQueryRepository) private sessionsQueryRepository: SessionsQueryRepository
    ) {
    }
    async createSession(userId: ObjectId, deviceId: ObjectId,
        ip: string, title: string, refreshToken: string): Promise<string | null> {

        const decoded = jwt.decode(refreshToken) as JwtPayload | null;
        
        if (!decoded || decoded.iat === undefined || decoded.exp === undefined) {
            throw new Error("Invalid JWT: missing 'iat' or 'exp' claims");
        }
        
            const expISO = new Date(decoded.exp * 1000).toISOString() 
            const iatISO = new Date(decoded.iat * 1000).toISOString() 
        


        const session = {
            userId,
            deviceId,
            iatISO,
            title,
            ip,
            expISO
        }
        const createSession = await this.sessionsRepository.createSession(session)

        return createSession;
    }

    async deleteAllSessionsExcludeCurrent(userId: string, deviceId: string): Promise<boolean> {
        const result = await this.sessionsRepository.deleteAllSessionsExcludeCurrent(userId, deviceId)
        return result
    }

    async deleteSessionById(deviceId: string): Promise<boolean> {
        const result = await this.sessionsRepository.deleteSessionById(deviceId)
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


        const result = await this.sessionsRepository.updateRefreshToken(userId, deviceId, iatISOnew, expISOnew)
        return result;
    }

    async checkRefreshToken(userId: string, deviceId: string, refreshToken: string): Promise<boolean> {
        const decoded = jwt.decode(refreshToken) as JwtPayload | null;

        if (!decoded || typeof decoded.exp !== 'number' || typeof decoded.iat !== 'number') {
            throw new Error('Invalid refresh token'); // Обработка случая, когда токен не может быть декодирован
        }


        const iat = decoded.iat


        const iatISO = iat ? new Date(iat * 1000).toISOString() : null;

        const checkIat = await this.sessionsQueryRepository.findSessionByIat(userId, deviceId, iatISO)
        if (!checkIat) {
            return false
        } else {
            return true
        }
    }
}