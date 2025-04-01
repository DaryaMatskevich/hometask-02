import { usersRepository } from "../Repository/usersRepository";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { emailManager } from "../managers/email-manager";
import { CreateUserDto } from "../types/UserTypes/CreateUserDto";
import { Result } from "../types/result/result.type";
import { ResultStatus } from "../types/result/resultCode";
import { bcryptService } from "./bcrypt-service";




export const usersService = {
    async createUser(dto: CreateUserDto): Promise<Result<string | null>> {
        const { login, email, password } = dto


        const existingUser = await usersRepository.findUserByLoginOrEmail(login, email)
        if (existingUser) {
            const errors: Array<{ message: string; field: string }> = [];

            if (existingUser.email === email) {
                errors.push({ message: 'email should be unique', field: 'email' })
            }
            if (existingUser.login === login) {
                errors.push({ message: 'login should be unique', field: 'login' })
            }
            return {
                status: ResultStatus.Forbidden,
                data: null,
                errorMessage: 'User already exists',
                extensions: errors
            }
        }
        const passwordHash = await bcryptService.hashPassword(password)

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
        const newUserId = await usersRepository.createUser(newUser)

        try {
            emailManager.sendEmailConfirmationMessage(newUser)
        } catch (error) {
            console.error(error)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Email confirmation mmessage do not sent',
                extensions: []
            }
        }
        return {
            status: ResultStatus.Success,
            data: newUserId,
            extensions: []
        }
    },


    async deleteUserById(id: string): Promise<Result<null>> {
        const isDeleted = await usersRepository.deleteUserById(id)
        if (isDeleted) {
            return {
                status: ResultStatus.Success,
                data: null,
                extensions: []
            }
        }
        else {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'User not found',
                extensions: [{
                    field: 'id',
                    message: 'User with this ID does not exist'
                }]
            }
        }
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<Result<any | null>> {
        const user = await usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) {
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not found',
                extensions: [{ field: 'loginOrEmail', message: 'Not found' }]
            };
        }

        // if (!user.isConfirmed) {
        //     const errors = []
        //     errors.push({ message: 'access denied'})

        //     return { errorsMessages: errors }
        // }

        const isPasswordCorrect = await bcryptService.checkPassword(password, user.password)
        if (!isPasswordCorrect)
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{ field: 'password', message: 'Wrong password' }]
            };
        return {
            status: ResultStatus.Success,
            data: user,
            extensions: []
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
            emailManager.sendEmailConfirmationMessage(updateUser)
        }
        catch (error) {
            console.error(error)
            return null
        }
        return updateResult
    },

    async sendPasswordRecoveryEmail(email: string):Promise<boolean | any> {
        let user = await usersQueryRepository.findUserByEmail(email)
      
        if (!user) {
            const errors = []
            errors.push({ message: 'email is not exist', field: 'email' })

            return { errorsMessages: errors }
        }
       
        const recoveryCode = uuidv4();
        const recoveryCodeExpirationDate = add(new Date(), {
            hours: 1
        })

     const saveRecoveryCode = await usersRepository.saveRecoveryCode(
        user._id, 
        recoveryCode, 
        recoveryCodeExpirationDate)

if (saveRecoveryCode) {
        try {
           await emailManager.sendPasswordRecoveryMessage(user, recoveryCode)
            return true
        } catch (emailError) {
            console.error('Error sending recovery email:', emailError)
            return null
    }
} else {
    return null
}},

async setNewPassword(newPassword: string, recoveryCode: string): Promise<boolean | any> {
const user = await usersQueryRepository.findUserByRecoveryCode(recoveryCode)
if (!user) {
    const errors = []
    errors.push({ message: 'code is invalid', field: 'code' })

    return { errorsMessages: errors }
}
if (user.recoveryCodeExpirationDate < new Date()) return false;
 else {
    const updatePassword = await usersRepository.updatePassword(user._id, newPassword)
return updatePassword
    } 
 }

}

