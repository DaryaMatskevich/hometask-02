import { Router, Request, Response } from "express";
import { securityDevicesRepository } from "../Repository/securityDevicesRepository";
import { securityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";
import { jwtService } from "../application/jwt-service";
import { securityDevicesServise } from "../domain/securityDevices-service";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices', async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken;
     if (!refreshToken) {
        res.sendStatus(401)
        return
     }
  
     const resultJwt = await jwtService.getUserIdByRefreshToken(refreshToken);
     const userId = resultJwt?.userId
     if (!userId) {
        res.sendStatus(401)
        return
     }
const result = await securityDevicesQueryRepository.findSecurityDevices(userId)
res.status(200).json(result)
return
})

securityDevicesRouter.delete('/devices', async (req: Request, res: Response) => {
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
const result = await securityDevicesServise.deleteAllSecurityDevicesExcludeCurrent(userId, deviceId)
res.sendStatus(204)
return
})

securityDevicesRouter.delete('/devices/:id', async (req: Request, res: Response) => {
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
const result = await securityDevicesServise.deleteSecurityDeviceById(userId, deviceId)
res.sendStatus(204)
return
})