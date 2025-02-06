import { MongoNetworkTimeoutError } from "mongodb";
import { usersRepository } from "../Repository/usersRepository";

const bcrypt = require('bcrypt')
const saltRounds = 10;
const bcryptService = {
    hashPassword: async (password: string) => {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
}

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<string> {
        const passwordHash = await bcryptService.hashPassword(password)
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
        if (!user) return false;
        return await usersRepository.deleteUserById(id)
    }
}