import { UsersRepository } from "../Repository/usersRepository";
import { v4 as uuidv4 } from "uuid";
import { add } from "date-fns";
import { emailManager } from "../managers/email-manager";
import { CreateUserDto } from "../types/UserTypes/CreateUserDto";
import { Result } from "../types/result/result.type";
import { ResultStatus } from "../types/result/resultCode";
import { bcryptService } from "../adapters/bcrypt-service";
import { ObjectId } from "mongodb";
import { UserDbType } from "../types/UserTypes/UserDBType";
import { inject, injectable } from "inversify";



@injectable()
export class UsersService {

    constructor(
        @inject(UsersRepository) private usersRepository: UsersRepository,
    ) {

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
        const passwordHash = await bcryptService.hashPassword(password)

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
            emailManager.sendEmailConfirmationMessage(user)
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

