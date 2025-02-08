import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation } from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { bcrypt } from "../domain/users-service";
export const authRouter = Router({})

authRouter.post('/', loginValidation, emailValidation, passwordValidation, async (req: Request, res: Response): Promise<any> => {
   const { loginOrEmail, password } = req.body;
   const user = await usersQueryRepository.findUserByLoginOrEmailforAuth(loginOrEmail)

   if (!user) {
      return res.sendStatus(401)
   }

   const isPasswordValid = await bcrypt.compare(password, user.password)



   if (!isPasswordValid) {
      return res.sendStatus(401)
   }

   res.sendStatus(401)
}
)
