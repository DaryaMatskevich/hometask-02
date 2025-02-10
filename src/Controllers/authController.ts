import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation } from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('/login', loginValidation, emailValidation, passwordValidation, 
   async (req: Request, res: Response) => {
   const { loginOrEmail, password } = req.body;
const user = await usersService.checkCredentials(loginOrEmail, password)
      if(user) {
const token = await jwtService.createJWT(user)
   res.status(201).send(token)
} else {
   res.sendStatus(401)
   }}
)

