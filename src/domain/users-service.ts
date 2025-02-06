import { MongoNetworkTimeoutError } from "mongodb";
import { usersRepository } from "../Repository/usersRepository";
import { usersCollection } from "../Repository/db";

const bcrypt = require('bcrypt')
const saltRounds = 10;
const bcryptService = {
    hashPassword: async (password: string) => {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
}

async function isEmailUnique(email: string): Promise<boolean> {
    const existingUser = await usersCollection.findOne({ email: email });
    return !existingUser;
}

async function isLoginUnique(login: string): Promise<boolean> {
    const existingUser = await usersCollection.findOne({ login: login });
    return !existingUser;
}


export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<string | any> {
        const passwordHash = await bcryptService.hashPassword(password)
        
const uniqueEmail = await isEmailUnique(email)
if (!uniqueEmail) 
    return {
    errorsMessages: [{ field: 'email', message: 'email should be unique' }]
};

const uniqueLogin = await isLoginUnique(login)
if (!uniqueLogin) return {
    errorsMessages: [{ field: 'email', message: 'email should be unique' }]
};

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