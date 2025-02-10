import { NextFunction, Request, Response } from "express";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";

export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
if (!req.headers.authorization) {
    res.sendStatus(401)
    return
}
const token = req.headers.authorization.split(' ')[1]

const userId = await jwtService.getUserIdByToken(token)
if (userId) {
    req.user = await usersQueryRepository.findUserById(userId)
    next()
}
res.sendStatus(401)
}