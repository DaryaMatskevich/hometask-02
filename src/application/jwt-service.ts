import jwt from 'jsonwebtoken'
import { UserDBType } from '../types/UserTypes/UserDBType'
import { SETTINGS } from '../settings'



export const jwtService = {
    async createJWT(user: UserDBType) {
        const token = jwt.sign({login: user.login, userId: user._id}, SETTINGS.JWT_SECRET, {expiresIn: '1h'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET)
            return result
        }
        catch (error) {
            return null
        }
    }
}