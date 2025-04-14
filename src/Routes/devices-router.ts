import { Router } from "express";
import { SETTINGS } from "../settings";
import { securityDevicesController } from "../Controllers/securityDevicesController";

export const securityDevicesRouter = Router()

securityDevicesRouter.get(SETTINGS.PATH.DEVICES.ROOT,
    securityDevicesController.getAllDevices.bind(securityDevicesController)
)

securityDevicesRouter.delete(SETTINGS.PATH.DEVICES.ROOT,
    securityDevicesController.deleteAllSecurityDevicesExcludeCurrent.bind(securityDevicesController)
)

securityDevicesRouter.delete(SETTINGS.PATH.DEVICES.ID,
    securityDevicesController.deleteSecurityDeviceById.bind(securityDevicesController)

)