import { Router } from "express";
import { SETTINGS } from "../settings";
import { container} from "../composition-root";
import {SessionsController } from "../Controllers/sessionsController"

const sessionsController = container.get(SessionsController)
export const sessionsRouter = Router()

sessionsRouter.get(SETTINGS.PATH.DEVICES.ROOT,
    sessionsController.getAllSessions.bind(sessionsController)
)

sessionsRouter.delete(SETTINGS.PATH.DEVICES.ROOT,
    sessionsController.deleteAllSessionsExcludeCurrent.bind(sessionsController)
)

sessionsRouter.delete(SETTINGS.PATH.DEVICES.ID,
    sessionsController.deleteSessionById.bind(sessionsController)

)