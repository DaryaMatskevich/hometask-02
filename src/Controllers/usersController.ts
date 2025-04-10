import { Request, Response, Router } from "express";
import { usersService } from "../domain/users-service";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { loginValidation, passwordValidation, emailValidation, inputValidationMiddleware } from "../Middlewares/middlewares";
import { SortDirection } from "mongodb";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { ResultStatus } from "../types/result/resultCode";

export const usersRouter = Router({})

usersRouter.get('/', authMiddleware, async (req: Request, res: Response): Promise<any> => {
    let pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1;
    let pageSize = req.query.pageSize ? +req.query.pageSize : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy.toString() : 'createdAt'
    let sortDirection: SortDirection =
        req.query.sortDirection && req.query.sortDirection.toString() === 'asc'
            ? 'asc'
            : 'desc'

    let searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm.toString() : null
    let searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm.toString() : null

    const foundUsers = await usersQueryRepository.findUsers(
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
        searchLoginTerm,
        searchEmailTerm
    )
    return res.status(200).json(foundUsers)
})

usersRouter.post('/', authMiddleware, loginValidation,
    passwordValidation, emailValidation, inputValidationMiddleware,
    async (req: Request, res: Response): Promise<any> => {
        const { login, email, password} = req.body;
        const createUserDto = {login, email, password}
        const result = await usersService.createUser(createUserDto)
        if (result.status === ResultStatus.Forbidden) {
            return res.status(400).json(result.extensions)
        }

        const newUser = await usersQueryRepository.findUserById(result.data!);
        return res.status(201).json(newUser)
    })


usersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<any> => {
    const user = await usersService.deleteUserById(req.params.id)
    if (!user)
        return res.sendStatus(404)

    return res.sendStatus(204)
})