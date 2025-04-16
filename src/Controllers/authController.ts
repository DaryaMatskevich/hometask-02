import { Request, Response } from "express";
import { UsersQueryRepository } from "../queryRepository/usersQueryRepository";
import { jwtService } from "../adapters/jwt-service";
import { UsersService } from "../domain/users-service";
import { ObjectId } from "mongodb";
import { SecurityDevicesServiсe } from "../domain/securityDevices-service";
import { SecurityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";
import { CreateUserDto } from "../types/UserTypes/CreateUserDto";
import { resultCodeToHttpException } from "../types/result/resultCodeToHttpStatus";
import { ResultStatus } from "../types/result/resultCode";
import { AuthService } from "../domain/auth-service";
import { injectable, inject } from "inversify";

@injectable()
export class AuthController {

   constructor(
      @inject(UsersService) private usersService: UsersService,
      @inject(AuthService) private authService: AuthService,
      @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
      @inject(SecurityDevicesServiсe) private securityDevicesService: SecurityDevicesServiсe,
      @inject(SecurityDevicesQueryRepository) private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
   ) {
   }
   async login(req: Request, res: Response) {
      const { loginOrEmail, password } = req.body;
      const userAgent = req.headers['user-agent'] || 'Unknown device'; // Значение по умолчанию
      const title = userAgent.includes('Mobile') ? 'Mobile Device' :
         userAgent.includes('Tablet') ? 'Tablet Device' :
            userAgent.includes('Desktop') ? 'Desktop Device' :
               'Unknown device';
      const ip = req.ip ?? 'Unknown IP';
      const result = await this.authService.checkCredentials(loginOrEmail, password)
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
         const createSecurityDevice = await this.securityDevicesService.createSecurityDevice(
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

   async me(req: Request, res: Response) {
      const result = req.user
      res.status(200).send(result)
   }

   async registration(req: Request, res: Response) {
      const createUserDto: CreateUserDto = {
         login: req.body.login,
         password: req.body.password,
         email: req.body.email
      };
      const result = await this.usersService.createUser(createUserDto)
      if (result.errorMessage) {
         res.status(resultCodeToHttpException(result.status)).json({ errorsMessages: result.errorMessage })
         return
      }
      else {
         res.sendStatus(204)
         return
      }
   }

   async registrationConfirmation(req: Request, res: Response) {
      const result = await this.authService.confirmEmail(req.body.code)
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
   }

   async registrationEmailResending(req: Request, res: Response) {
      const result = await this.authService.resendConfirmationEmail(req.body.email)
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

   async refreshToken(req: Request, res: Response) {
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

      const checkRefreshToken = await this.securityDevicesService.checkRefreshToken(userId, deviceId, refreshToken)
      if (!checkRefreshToken) {
         res.sendStatus(401)
         return
      }

      const user = await this.usersQueryRepository.findUserByObjectId(userId);
      if (!user) {
         res.sendStatus(401)
         return
      }

      const findDevice = await this.securityDevicesQueryRepository.findSecurityDeviceByDeviceId(deviceId)
      if (!findDevice) {
         res.sendStatus(401)
         return
      }

      const newAccessToken = await jwtService.createJWT(userId, deviceId);
      const newRefreshToken = await jwtService.createRefreshToken(userId, deviceId);



      const newTokens = await this.securityDevicesService.updateRefreshToken(userId, deviceId, newRefreshToken)

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

   async logout(req: Request, res: Response) {
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

      const checkRefreshToken = await this.securityDevicesService.checkRefreshToken(userId, deviceId, refreshToken)
      if (!checkRefreshToken) {
         res.sendStatus(401)
         return
      }
      const deleteDevice = await this.securityDevicesService.deleteSecurityDeviceById(deviceId)

      if (deleteDevice) {

         res.clearCookie('refreshToken')
         res.sendStatus(204)
         return
      }
   }

   async passwordRecovery(req: Request, res: Response) {
      const email = req.body.email
      const result = await this.authService.sendPasswordRecoveryEmail(email)
      if (result.status === ResultStatus.Success) {
         res.sendStatus(resultCodeToHttpException(result.status))
         return
      }
      if (result.status === ResultStatus.NotFound) {
         res.sendStatus(resultCodeToHttpException(result.status))
         return
      }
   }

   async newPassword(req: Request, res: Response) {
      const newPassword = req.body.newPassword
      const recoveryCode = req.body.recoveryCode
      const result = await this.authService.setNewPassword(newPassword, recoveryCode)

      if (result.status === ResultStatus.Unauthorized) {
         res.status(resultCodeToHttpException(result.status)).json({ errorsMessages: result.extensions })
         return
      }

      if (result.status === ResultStatus.BadRequest) {
         res.status(resultCodeToHttpException(result.status)).json({ errorsMessages: result.extensions })
         return
      }


      if (result.status === ResultStatus.Success) {
         res.sendStatus(resultCodeToHttpException(result.status))
         return
      }
   }
}


