import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation} from "../Middlewares/middlewares";
import {authMiddleware } from "../Middlewares/authMiddleware"
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
export const authRouter = Router({})

authRouter.post('/', authMiddleware, loginValidation, emailValidation, passwordValidation, async (req: Request, res: Response): Promise<any> => {
    const {loginOrEmail, password} = req.body;
     const user = await usersQueryRepository.findUserByLoginOrEmailforAuth(loginOrEmail) 
    if (user) {
     return res.sendStatus(204)}
     else {
        return res.sendStatus(401)
     }
    })
    