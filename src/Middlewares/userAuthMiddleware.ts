import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";

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
    const foundUser = await usersQueryRepository.findUserByIdForAuth(userId)
    
    if (foundUser.isConfirmed === false) {
        res.sendStatus(403)
        return
    }
    req.user = await usersQueryRepository.findUserByIdforAuth(userId)

    next()

}