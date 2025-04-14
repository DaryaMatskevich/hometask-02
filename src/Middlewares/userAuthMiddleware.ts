import { NextFunction, Request, Response } from "express";
import { jwtService } from "../adapters/jwt-service";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";


export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || !req.headers.authorization.includes('Bearer ')) {
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]

    const result = await jwtService.getUserIdByToken(token)
  
    if (!result) {
        res.sendStatus(401)
        return
    }

    req.user = await usersQueryRepository.findUserByIdforAuth(result.userId)

    next()

}