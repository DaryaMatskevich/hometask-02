import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation} from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { bcryptService } from "../domain/users-service";
export const authRouter = Router({})

authRouter.post('/', loginValidation, emailValidation, passwordValidation, async (req: Request, res: Response): Promise<any> => {
    const {loginOrEmail, password} = req.body;
     const user = await usersQueryRepository.findUserByLoginOrEmailforAuth(loginOrEmail) 
     const hashedPassword = bcryptService.hashPassword(password)
 
 
     if (user.password === hashedPassword) {
      res.sendStatus(204)}
     if (user.password ==! hashedPassword || user.login ==! loginOrEmail || user.email !== loginOrEmail) {
        res.sendStatus(401)
     }
    })
    