import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation, newPasswordValidation, emailValidation, inputValidationMiddleware } from "../Middlewares/middlewares";
import { usersQueryRepository } from "../queryRepository/usersQueryRepository";
import { jwtService } from "../application/jwt-service";
import { usersService } from "../domain/users-service";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";
import { ObjectId } from "mongodb";
import { securityDevicesServise } from "../domain/securityDevices-service";
import { requestCountMiddleware } from "../Middlewares/requestCountMiddleware";
import { securityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";
import { CreateUserDto } from "../types/UserTypes/CreateUserDto";
import { resultCodeToHttpException } from "../types/result/resultCodeToHttpStatus";
import { ResultStatus } from "../types/result/resultCode";


export const authRouter = Router({})

authRouter.post('/login', requestCountMiddleware, async (req: Request, res: Response) => {
   const { loginOrEmail, password } = req.body;
   const userAgent = req.headers['user-agent'] || 'Unknown device'; // Значение по умолчанию
   const title = userAgent.includes('Mobile') ? 'Mobile Device' :
      userAgent.includes('Tablet') ? 'Tablet Device' :
         userAgent.includes('Desktop') ? 'Desktop Device' :
            'Unknown device';
   const ip = req.ip ?? 'Unknown IP';
   const result = await usersService.checkCredentials(loginOrEmail, password)
   if (result.status === ResultStatus.Unauthorized) {
      res.sendStatus(401)
      return
   }
   // if (result.errorMessage) {
   //    res.status(403).json({ errorsMessages: result.errorMessage })
   //    return
   // }

   if (result.status === ResultStatus.Success) {
      const user = result.data
      const userId = user._id.toString()
      const deviceId = new ObjectId().toString()
      const token = await jwtService.createJWT(userId, deviceId)
      const refreshToken = await jwtService.createRefreshToken(userId, deviceId)
      const createSecurityDevice = await securityDevicesServise.createSecurityDevice(
         user._id,
         new ObjectId(deviceId),
         ip,
         title,
         refreshToken)

      if (createSecurityDevice) {
         res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true
         })

         res.status(200).json({ accessToken: token })
         return
      }
   } else {
      res.sendStatus(401)
      return
   }
}
)

authRouter.get('/me', userAuthMiddleware, async (req: Request, res: Response) => {
   const result = req.user
   res.status(200).send(result)
}
)

authRouter.post('/registration', requestCountMiddleware, loginValidation, emailValidation, passwordValidation,
   inputValidationMiddleware, async (req: Request, res: Response) => {
      const createUserDto: CreateUserDto = {
         login: req.body.login,
         password: req.body.password,
         email: req.body.email
       };
            const result = await usersService.createUser(createUserDto)
      if (result.errorMessage) {
         res.status(resultCodeToHttpException(result.status)).json({ errorsMessages: result.errorMessage })
         return
      }
      else {
         res.sendStatus(204)
         return
      }
   })

authRouter.post('/registration-confirmation', requestCountMiddleware, async (req: Request, res: Response) => {
   const result = await usersService.confirmEmail(req.body.code)
   if (result.errorsMessages) {
      res.status(400).json({ errorsMessages: result.errorsMessages })
      return
   }
   if (result) {
      res.sendStatus(204)
      return
   } else {
      res.sendStatus(400)
      return
   }
})

authRouter.post('/registration-email-resending', requestCountMiddleware, async (req: Request, res: Response) => {
   const result = await usersService.resendConfirmationEmail(req.body.email)
   if (result) {
      res.sendStatus(204)
      return
   }
   if (result.errorsMessages) {
      res.status(400).json({ errorsMessages: result.errorsMessages })
      return
   }
   else {
      res.sendStatus(400)
      return
   }
}
)

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
      res.sendStatus(401)
      return
   }

   const tokenPayload = await jwtService.getUserIdByRefreshToken(refreshToken);
   if (!tokenPayload) {
      res.sendStatus(401)
      return
   }
   const userId = tokenPayload.userId
   const deviceId = tokenPayload.deviceId

   const checkRefreshToken = await securityDevicesServise.checkRefreshToken(userId, deviceId, refreshToken)
   if (!checkRefreshToken) {
      res.sendStatus(401)
      return
   }

   const user = await usersQueryRepository.findUserByObjectId(userId);
   if (!user) {
      res.sendStatus(401)
      return
   }

   const findDevice = await securityDevicesQueryRepository.findSecurityDeviceByDeviceId(deviceId)
   if (!findDevice) {
      res.sendStatus(401)
      return
   }

   const newAccessToken = await jwtService.createJWT(userId, deviceId);
   const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId);



   const newTokens = await securityDevicesServise.updateRefreshToken(userId, deviceId, newRefreshToken)

   if (newTokens) {
      res.cookie('refreshToken', newRefreshToken, {
         httpOnly: true,
         secure: true,
      })
      res.status(200).json({ accessToken: newAccessToken });
      return
   } else res.sendStatus(401)
   return
}
);


authRouter.post('/logout', async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken;

   if (!refreshToken) {
      res.sendStatus(401); // Токен отсутствует
      return
   }

   const jwtPayload = await jwtService.getUserIdByRefreshToken(refreshToken)

   if (!jwtPayload) {
      res.sendStatus(401)
      return
   }
   const deviceId = jwtPayload.deviceId
   const userId = jwtPayload.userId

   const checkRefreshToken = await securityDevicesServise.checkRefreshToken(userId, deviceId, refreshToken)
   if (!checkRefreshToken) {
      res.sendStatus(401)
      return
   }
   const deleteDevice = await securityDevicesServise.deleteSecurityDeviceById(deviceId)

   if (deleteDevice) {

      res.clearCookie('refreshToken')
      res.sendStatus(204)
      return
   }
});

authRouter.post('/password-recovery', requestCountMiddleware, emailValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
const email = req.body.email
const result = await usersService.sendPasswordRecoveryEmail(email)
if(result){
   res.sendStatus(204)
   return
}
})

authRouter.post('/new-password', requestCountMiddleware, newPasswordValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
const newPassword = req.body.newPassword
const recoveryCode = req.body.recoveryCode
const result = await usersService.setNewPassword(newPassword, recoveryCode)

if (result.status === ResultStatus.Unauthorized) {
   res.status(resultCodeToHttpException(result.status)).json({ errorsMessages: result.extensions })
   return}

   if (result.status === ResultStatus.BadRequest) {
      res.status(resultCodeToHttpException(result.status)).json({ errorsMessages: result.extensions })
      return}


 else {
   res.sendStatus(204)
   return
}
}
)
