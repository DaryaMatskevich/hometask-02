import { UsersRepository } from "../Repository/usersRepository";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { EmailManager } from "../managers/email-manager";
import { CreateUserDto } from "../types/UserTypes/CreateUserDto";
import { Result } from "../types/result/result.type";
import { ResultStatus } from "../types/result/resultCode";
import { BcryptService } from "../adapters/bcrypt-service";
import { ObjectId } from "mongodb";
import { UserDbType } from "../types/UserTypes/UserDBType";




export class UsersService {

    private usersRepository: UsersRepository
    private emailManager: EmailManager
    private bcryptService: BcryptService
    constructor() {
        this.usersRepository = new UsersRepository()
        this.emailManager = new EmailManager()
        this.bcryptService = new BcryptService()
    }
    async createUser(dto: CreateUserDto): Promise<Result<string | null>> {
        const { login, email, password } = dto

        const existingUser = await this.usersRepository.findUserByLoginOrEmail(login, email)
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
        const passwordHash = await this.bcryptService.hashPassword(password)

        let user = new UserDbType(
            new ObjectId(),
            login,
            email,
            passwordHash,
            new Date(),
            uuidv4(),
            add(new Date(), {
                hours: 1
            }),
            false
        )
        const newUserId = await this.usersRepository.createUser(user)

        try {
            this.emailManager.sendEmailConfirmationMessage(user)
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
    }
    async deleteUserById(id: string): Promise<Result<null>> {
        const isDeleted = await this.usersRepository.deleteUserById(id)
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
    }
}

