import { Router, Request, Response } from "express";
import { securityDevicesRepository } from "../Repository/securityDevicesRepository";
import { securityDevicesQueryRepository } from "../queryRepository/securityDevicesQueryRepository";

export const securityDevicesRouter = Router({})

securityDevicesRouter.get('/devices', async (req: Request, res: Response) => {
const result = await securityDevicesQueryRepository.findSecurityDevices()
res.status(200).json(result)
return
})

securityDevicesRouter.delete('/devices', async (req: Request, res: Response) => {

})

securityDevicesRouter.delete('/devices/:id', async (req: Request, res: Response) => {

})