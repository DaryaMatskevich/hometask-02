import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation } from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";

export const authRouter = Router({})

authRouter.post('/login', loginValidation, emailValidation, passwordValidation, 
   async (req: Request, res: Response) => {
   const { loginOrEmail, password } = req.body;
const user = await usersService.checkCredentials(loginOrEmail, password)
      if(user) {
const token = await jwtService.createJWT(user)
   res.status(200).json({accessToken: token})
} else {
   res.sendStatus(401)
   }}
)

authRouter.get('/me', userAuthMiddleware, async (req: Request, res: Response) => {
      const result = req.user
   res.status(200).send(result)
}
)

