import jwt from 'jsonwebtoken'
import { UserDBType } from '../types/UserTypes/UserDBType'
import { SETTINGS } from '../settings'





export const jwtService = {
    async createJWT(user: UserDBType) {
        const token = jwt.sign({ userId: user._id }, SETTINGS.JWT_SECRET, { expiresIn: '10s' })
        return token
    },

    async createRefreshToken(user: UserDBType) {
        const refreshToken = jwt.sign({ userId: user._id }, SETTINGS.JWT_REFRESH_SECRET, { expiresIn: '20s' })
        return refreshToken
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result.userId
        }
        catch (error) {
            return null
        }
    },

    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_REFRESH_SECRET)
            return result.userId
        }
        catch (error) {
            return null
        }
    }
}