import { usersRepository } from "../Repository/usersRepository";


import bcrypt from 'bcrypt'
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { emailManager } from "../managers/email-manager";

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
            createdAt: new Date(),
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                hours: 1
            }),
            isConfirmed: false
        }
        const createResult = await usersRepository.createUser(newUser)
        try {
            emailManager.sendEmailConfirmationMessage(newUser)
        } catch (error) {
            console.error(error)
            return null
        }
        return createResult
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
        

        // if (!user.isConfirmed) {
        //     const errors = []
        //     errors.push({ message: 'access denied'})

        //     return { errorsMessages: errors }
        // }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            return user
        } else {
            return null
        }
        
        
    },
    async confirmEmail(code: string): Promise<boolean | any> {
        let user = await usersQueryRepository.findUserByConfirmationCode(code)
        // if (!user) return false;
        // if(user.isConfirmed) return false;

        if (!user) {
            const errors = []
            errors.push({ message: 'code is invalid', field: 'code' })

            return { errorsMessages: errors }
        }
        if (user.expirationDate < new Date()) return false;

        if (user.isConfirmed) {
            const errors = []
            errors.push({ message: 'code is already confirmed', field: 'code' })


            return { errorsMessages: errors }
        }
        let result = await usersRepository.updateConfirmation(user._id)
        return result
    },

    async resendConfirmationEmail(email: string): Promise<boolean | any> {
        let user = await usersQueryRepository.findUserByEmail(email)
        // if (!user) return false;
        // if (user.isConfirmed) return false;

        if (!user) {
            const errors = []
            errors.push({ message: 'email is not exist', field: 'email' })

            return { errorsMessages: errors }
        }

        if (user.isConfirmed) {
            const errors = []
            errors.push({ message: 'email is already confirmed', field: 'email' })


            return { errorsMessages: errors }
        }
        const newConfirmationCode = uuidv4();
        const newExpirationDate = add(new Date(), {
            hours: 1
        })

        const updateResult = await usersRepository.updateUserConfirmationCode(user._id, newConfirmationCode, newExpirationDate)
        if (!updateResult) return false;

        const updateUser = await usersQueryRepository.findUserByEmail(email)
        if (!updateUser) return false;

        try {
            await emailManager.sendEmailConfirmationMessage(updateUser)
        }
        catch (error) {
            console.error(error)
            return null
        }
        return updateResult
    }
}