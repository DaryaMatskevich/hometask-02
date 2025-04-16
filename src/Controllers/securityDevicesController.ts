import { Router, Request, Response } from "express";
import { SecurityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";
import { jwtService } from "../adapters/jwt-service";
import { SecurityDevicesServiсe } from "../domain/securityDevices-service";
import { inject, injectable } from "inversify";
@injectable()
export class SecurityDevicesController {

   constructor( 
      @inject(SecurityDevicesServiсe) private securityDevicesService: SecurityDevicesServiсe,
      @inject (SecurityDevicesQueryRepository) private securityDevicesQueryRepository: SecurityDevicesQueryRepository
          ){
   }

   async getAllDevices(req: Request, res: Response) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
         res.sendStatus(401)
         return
      }

      const resultJwt = await jwtService.getUserIdByRefreshToken(refreshToken);

      if (!resultJwt) {
         res.sendStatus(401)
         return
      }

      const userId = resultJwt.userId

      const result = await this.securityDevicesQueryRepository.findSecurityDevices(userId)

      if (result) {
         res.status(200).json(result)
         return
      } else {
         res.sendStatus(404)
         return
      }
   }

   async deleteAllSecurityDevicesExcludeCurrent(req: Request, res: Response) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
         res.sendStatus(401)
         return
      }
      const resultJwt = await jwtService.getUserIdByRefreshToken(refreshToken);
      const userId = resultJwt?.userId
      const deviceId = resultJwt?.deviceId
      if (!userId) {
         res.sendStatus(401)
         return
      }
      const result = await this.securityDevicesService.deleteAllSecurityDevicesExcludeCurrent(userId, deviceId)
      if (result) {
         res.sendStatus(204)
         return
      } else {
         res.sendStatus(401)
         return
      }
   }
   async deleteSecurityDeviceById(req: Request, res: Response) {
      const refreshToken = req.cookies.refreshToken;
      const deviceId = req.params.id

      if (!refreshToken) {
         res.sendStatus(401)
         return
      }

      const result = await this.securityDevicesQueryRepository.findSecurityDeviceByDeviceId(deviceId)

      if (!result) {
         res.sendStatus(404)
         return
      }

      const user = await jwtService.getUserIdByRefreshToken(refreshToken);

      if (!user) {
         res.sendStatus(401)
         return
      }

      if (user.userId !== result.userId.toString()) {
         res.sendStatus(403)
         return
      }


      const deleteDevice = await this.securityDevicesService.deleteSecurityDeviceById(deviceId)
      if (deleteDevice) {
         res.sendStatus(204)
         return
      }
      else {
         res.sendStatus(403)
         return
      }

   }
}
