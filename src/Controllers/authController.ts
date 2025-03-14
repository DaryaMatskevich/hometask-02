import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, emailValidation, inputValidationMiddleware } from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { ObjectId } from "mongodb";
import { securityDevicesServise } from "../domain/securityDevices-service";


export const authRouter = Router({})
const blacklistedTokens = new Set<string>()

authRouter.post('/login', loginValidation, emailValidation, passwordValidation, async (req: Request, res: Response) => {
   const { loginOrEmail, password } = req.body;
   const userAgent = req.headers['user-agent'] || 'Unknown device'; // Значение по умолчанию
   const title = userAgent.includes('Mobile') ? 'Mobile Device' :
      userAgent.includes('Tablet') ? 'Tablet Device' :
         userAgent.includes('Desktop') ? 'Desktop Device' :
            'Unknown device';
   const ip = req.ip ?? 'Unknown IP';
   const user = await usersService.checkCredentials(loginOrEmail, password)
   if (!user) {
      res.sendStatus(401)
      return
   }
   if (user.errorsMessages) {
      res.status(403).json({ errorsMessages: user.errorsMessages })
      return
   }
   if (user) {
      const deviceId = new ObjectId()
      const token = await jwtService.createJWT(user, deviceId)
      const refreshToken = await jwtService.createRefreshToken(user, deviceId)
const createSecurityDevice = await securityDevicesServise.createSecurityDevice(
   user._id, 
   deviceId, 
   ip, 
   title, 
   refreshToken)
      res.cookie('refreshToken', refreshToken, {
         httpOnly: true,
         secure: true
      })

      res.status(200).json({ accessToken: token })
      return
   }
}
)

authRouter.get('/me', userAuthMiddleware, async (req: Request, res: Response) => {
   const result = req.user
   res.status(200).send(result)
}
)

authRouter.post('/registration', loginValidation, emailValidation, passwordValidation,
   inputValidationMiddleware, async (req: Request, res: Response) => {
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

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken || blacklistedTokens.has(refreshToken)) {
      res.sendStatus(401)
      return
   }

   const result = await jwtService.getUserIdByRefreshToken(refreshToken);
   const userId = result?.userId
   const deviceId = result?.deviceId
   if (!userId) {
      res.sendStatus(401)
      return
   }
   blacklistedTokens.add(refreshToken)
   const user = await usersQueryRepository.findUserByObjectId(userId);

   // Генерируем новый accessToken

   if (!user) {
      res.sendStatus(401)
      return
   }

   const newAccessToken = await jwtService.createJWT(user, deviceId);
   const newRefreshToken = await jwtService.createRefreshToken(user, deviceId);
   const updateRefreshToken = await securityDevicesServise.updateRefreshToken(user._id, refreshToken, newRefreshToken)

   if (updateRefreshToken) {
   res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
   })
   res.status(200).json({ accessToken: newAccessToken });
   return
} else res.sendStatus(401)
return}
);


authRouter.post('/logout', async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken || blacklistedTokens.has(refreshToken)) {
      res.sendStatus(401); // Токен отсутствует
      return
   }

   const userId = await jwtService.getUserIdByRefreshToken(refreshToken)

   if (!userId) {
      res.sendStatus(401)
      return
   }

   blacklistedTokens.add(refreshToken); // Добавляем в blacklist


   res.clearCookie('refreshToken')
   res.sendStatus(204)
   return
});
