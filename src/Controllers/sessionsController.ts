import { Request, Response } from "express";
import { SessionsQueryRepository } from "../queryRepository/sessionsQueryRepository";
import { jwtService } from "../adapters/jwt-service";
import { SessionsServiсe } from "../domain/sessions-service";
import { inject, injectable } from "inversify";
@injectable()
export class SessionsController {

   constructor( 
      @inject(SessionsServiсe) private sessionsService: SessionsServiсe,
      @inject (SessionsQueryRepository) private sessionsQueryRepository: SessionsQueryRepository
          ){
   }

   async getAllSessions(req: Request, res: Response) {
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

      const result = await this.sessionsQueryRepository.findSessions(userId)

      if (result) {
         res.status(200).json(result)
         return
      } else {
         res.sendStatus(404)
         return
      }
   }

   async deleteAllSessionsExcludeCurrent(req: Request, res: Response) {
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
      const result = await this.sessionsService.deleteAllSessionsExcludeCurrent(userId, deviceId)
      if (result) {
         res.sendStatus(204)
         return
      } else {
         res.sendStatus(401)
         return
      }
   }
   async deleteSessionById(req: Request, res: Response) {
      const refreshToken = req.cookies.refreshToken;
      const deviceId = req.params.id

      if (!refreshToken) {
         res.sendStatus(401)
         return
      }

      const result = await this.sessionsQueryRepository.findSessionByDeviceId(deviceId)

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


      const deleteDevice = await this.sessionsService.deleteSessionById(deviceId)
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
