import { Router } from "express";
import { SETTINGS } from "../settings";
import { container} from "../composition-root";
import {SecurityDevicesController } from "../Controllers/securityDevicesController"

const securityDevicesController = container.get(SecurityDevicesController)
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