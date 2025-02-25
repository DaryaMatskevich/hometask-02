import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation, inputValidationMiddleware } from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";

export const authRouter = Router({})

authRouter.post('/login', loginValidation, emailValidation, passwordValidation, async (req: Request, res: Response) => {
   const { loginOrEmail, password } = req.body;
const user = await usersService.checkCredentials(loginOrEmail, password)
      if(user) {
const token = await jwtService.createJWT(user)
   res.status(200).json({accessToken: token})
} 
   res.sendStatus(401)
   }
)

authRouter.get('/me', userAuthMiddleware, async (req: Request, res: Response) => {
      const result = req.user
   res.status(200).send(result)
}
)

authRouter.post('/registration', loginValidation, emailValidation, passwordValidation, async (req: Request, res: Response) => {
const user = await usersService.createUser(req.body.login, req.body.password, req.body.email)
if (user.errorsMessages) {
   res.status(400).json({ errorsMessages: user.errorsMessages })
}
else {
   res.sendStatus(204)
}
})

authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {
const result = await usersService.confirmEmail(req.body.code)
if (result.errorsMessages) {
   res.status(400).json({ errorsMessages: result.errorsMessages })
}
if (result) {
   res.sendStatus(204)
} else {
   res.sendStatus(400)
}
})

authRouter.post('/registration-email-resending', async (req: Request, res: Response) => {
   const result = await usersService.resendConfirmationEmail(req.body.email)
   if (result.errorsMessages) {
      res.status(400).json({ errorsMessages: result.errorsMessages })
   }
   if (result) {
      res.sendStatus(204) 
   } else {
      res.sendStatus(400)
   }
})