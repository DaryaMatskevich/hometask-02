import { usersRepository } from "../Repository/usersRepository";


import bcrypt from 'bcrypt'
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";

const saltRounds = 10;
const bcryptService = {
    hashPassword: async (password: string) => {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
}


export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<any> {
        const passwordHash = await bcryptService.hashPassword(password)

        const existingUser = await usersRepository.findUserByLoginOrEmail(login, email)
        if (existingUser) {
            const errors = []
            if (existingUser.email === email) {
                errors.push({ message: 'email should be unique', field: 'email' })
            }
            if (existingUser.login === login) {
                errors.push({ message: 'login should be unique', field: 'login' })
            }
            return { errorsMessages: errors }
        }
        const newUser = {
            login: login,
            email: email,
            password: passwordHash,
            createdAt: new Date()
        }
        return await usersRepository.createUser(newUser)
    },


    async deleteUserById(id: string): Promise<boolean> {
        const user = await usersRepository.findUserById(id)
        if (!user) return false
        return await usersRepository.deleteUserById(id)
    },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersQueryRepository.findUserByLoginOrEmailforAuth(loginOrEmail)
        if (!user) {
            return null
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            return user
        } else {
            return null
        }
    }
}