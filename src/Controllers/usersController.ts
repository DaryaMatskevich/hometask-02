import { Request, Response, Router } from "express";
import { UsersService } from "../domain/users-service";
import { UsersQueryRepository } from "../queryRepository/usersQueryRepository";
import { SortDirection } from "mongodb";
import { ResultStatus } from "../types/result/resultCode";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {


    constructor(
        @inject(UsersService) private usersService: UsersService,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository) {
}
    async getUsers(req: Request, res: Response): Promise<any> {
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
        let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
        let sortDirection: SortDirection =
            req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
                ? 'asc'
                : 'desc'

        let searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null
        let searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null

        const foundUsers = await this.usersQueryRepository.findUsers(
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        )
        return res.status(200).json(foundUsers)
    }


    async createUser(req: Request, res: Response): Promise<any> {
        const { login, email, password } = req.body;
        const createUserDto = { login, email, password }
        const result = await this.usersService.createUser(createUserDto)
        if (result.status === ResultStatus.Forbidden) {
            return res.status(400).json(result.extensions)
        }

        const newUser = await this.usersQueryRepository.findUserById(result.data!);
        return res.status(201).json(newUser)
    }


    async deleteUserById(req: Request, res: Response): Promise<any> {
        const user = await this.usersService.deleteUserById(req.params.id)
        if (!user)
            return res.sendStatus(404)

        return res.sendStatus(204)
    }
}
