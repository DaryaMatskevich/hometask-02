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
if (result) {
res.sendStatus(204)
return
} else {
   res.sendStatus(401)
   return
}
})

securityDevicesRouter.delete('/devices/:id', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.id

    if (!refreshToken) {
      res.sendStatus(401)
      return
   }
  
const result = await securityDevicesQueryRepository.findSecurityDeviceByDeviceId(deviceId)

    if(!result) {
      res.sendStatus(404)
    }

    const user = await jwtService.getUserIdByRefreshToken(refreshToken);
   
    if (!user) {
       res.sendStatus(401)
       return
    }
     const userId = user.userId
    

    const checkDeviceId = await securityDevicesQueryRepository.findSecurityDeviceByDeviceIdandUserId(userId, deviceId)

    if(checkDeviceId) {
const result = await securityDevicesServise.deleteSecurityDeviceById(deviceId)
if(result) {

res.sendStatus(204)
return}
} else {
   res.sendStatus(404)
   return
}})