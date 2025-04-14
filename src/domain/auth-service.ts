import { UsersQueryRepository} from "../queryRepository/usersQueryRepository";
import { UsersRepository } from "../Repository/usersRepository";
import { ResultStatus } from "../types/result/resultCode";
import { BcryptService } from "../adapters/bcrypt-service";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { EmailManager } from "../managers/email-manager";
import { Result } from "../types/result/result.type";

export class AuthService {

    private usersRepository: UsersRepository
    private usersQueryRepository: UsersQueryRepository
    private bcryptService: BcryptService
    private emailManager: EmailManager


    constructor(){
        this.usersRepository = new UsersRepository()
        this.usersQueryRepository = new UsersQueryRepository()
        this.bcryptService = new BcryptService()
        this.emailManager = new EmailManager()

    }
    async checkCredentials(loginOrEmail: string, password: string): Promise<Result<any | null>> {
        const user = await this.usersQueryRepository.findUserByLoginOrEmail(loginOrEmail)
        if (!user) {
            return {
                status: ResultStatus.Unauthorized,
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

        const isPasswordCorrect = await this.bcryptService.checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',
                extensions: [{ field: 'password', message: 'Wrong password' }]
            } }
            else {
        return {
            status: ResultStatus.Success,
            data: user,
            extensions: []
        }
    }
}

    async confirmEmail(code: string): Promise<boolean | any> {
        let user = await this.usersQueryRepository.findUserByConfirmationCode(code)
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
        let result = await this.usersRepository.updateConfirmation(user._id)
        return result
    }

    async resendConfirmationEmail(email: string): Promise<boolean | any> {
        let user = await this.usersQueryRepository.findUserByEmail(email)
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

        const updateResult = await this.usersRepository.updateUserConfirmationCode(user._id, newConfirmationCode, newExpirationDate)
        if (!updateResult) return false;

        const updateUser = await this.usersQueryRepository.findUserByEmail(email)
        if (!updateUser) return false;

        try {
            this.emailManager.sendEmailConfirmationMessage(updateUser)
        }
        catch (error) {
            console.error(error)
            return null
        }
        return updateResult
    }

    async sendPasswordRecoveryEmail(email: string): Promise<boolean | any> {

        let user = await this.usersQueryRepository.findUserByEmail(email)

        if (!user) {
            const errors = []
            errors.push({ message: 'email is not exist', field: 'email' })

            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'User not found',
                extensions: errors
            }
        }

        const recoveryCode = uuidv4();
        const recoveryCodeExpirationDate = add(new Date(), {
            hours: 1
        })

        const saveRecoveryCode = await this.usersRepository.saveRecoveryCode(
            user._id,
            recoveryCode,
            recoveryCodeExpirationDate)

        if (saveRecoveryCode) {
            try {
                await this.emailManager.sendPasswordRecoveryMessage(user, recoveryCode)
                return {
                    status: ResultStatus.Success,
                    data: null,
                    extensions: []
                }
            } catch (emailError) {
                console.error('Error sending recovery email:', emailError)
                return null
            }
        } else {
            return null
        }
    }

    async setNewPassword(newPassword: string, recoveryCode: string): Promise<boolean | any> {
        const user = await this.usersQueryRepository.findUserByRecoveryCode(recoveryCode)
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{ message: 'recoveryCode is incorrect', field: 'recoveryCode' }]
            }
        }
        const isSamePassword = await this.bcryptService.checkPassword(newPassword, user.password);
        if (isSamePassword) {
            return {
                status: ResultStatus.Unauthorized,
                data: null,
                errorMessage: 'Unauthorized',
                extensions: [{ message: 'password is incorrect', field: 'password' }]
            }
        }
        const passwordHash = await this.bcryptService.hashPassword(newPassword)
        if (user.recoveryCodeExpirationDate < new Date()) return {
            status: ResultStatus.Unauthorized,
            data: null,
            errorMessage: 'Unauthorized',
            extensions: [{ message: 'recoveryCode is incorrect', field: 'recoveryCode' }]
        }
        else {
            const updatePassword = await this.usersRepository.updatePassword(user._id, passwordHash)
            return {
                status: ResultStatus.Success,
                data: updatePassword,
                extensions: []
            }
            
        }
    }
}

