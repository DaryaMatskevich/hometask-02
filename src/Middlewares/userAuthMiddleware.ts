import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { usersService } from "../domain/users-service";

export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) {
        res.sendStatus(401)
        return
    }

    req.user = await usersQueryRepository.findUserByIdforAuth(userId)
const user = await usersQueryRepository.findUserByIdforCheckConfirmation(userId)
    
if(!user.isConfirmed) {
    res.sendStatus(403)
}
    next()

}