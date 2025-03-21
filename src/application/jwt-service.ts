import jwt from 'jsonwebtoken'
import { SETTINGS } from '../settings'


export const jwtService = {
    async createJWT(userId: string, deviceId: string) {
        const token = jwt.sign({ userId: userId, deviceId: deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
        return token
    },

    async createRefreshToken(userId: string, deviceId: string) {
        const refreshToken = jwt.sign({ userId: userId, deviceId: deviceId }, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: '20m' })
        return refreshToken
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return { userId: result.userId, deviceId: result.deviceId }
        }
        catch (error) {
            return null
        }
    },

    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET)
            return { userId: result.userId, deviceId: result.deviceId }
        }
        catch (error) {
            return null
        }
    }
}