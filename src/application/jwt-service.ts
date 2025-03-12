import jwt from 'jsonwebtoken'
import { UserDBType } from '../types/UserTypes/UserDBType'
import { SETTINGS } from '../settings'
import { ObjectId } from 'mongodb'





export const jwtService = {
    async createJWT(user: UserDBType, deviceId: ObjectId) {
        const token = jwt.sign({ userId: user._id, deviceId: deviceId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
        return token
    },

    async createRefreshToken(user: UserDBType, deviceId: ObjectId) {
        const refreshToken = jwt.sign({ userId: user._id, deviceId: deviceId }, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: '20s' })
        return refreshToken
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return {userId: result.userId, deviceId: result.deviceId}
        }
        catch (error) {
            return null
        }
    },

    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET)
            return {userId: result.userId, deviceId: result.deviceId}
        }
        catch (error) {
            return null
        }
    }
}