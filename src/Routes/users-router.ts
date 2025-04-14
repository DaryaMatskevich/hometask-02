import { Router } from "express";
import { SETTINGS } from "../settings";
import { authMiddleware } from "../Middlewares/authMiddleware";
import { emailValidation, inputValidationMiddleware, loginValidation, passwordValidation } from "../Middlewares/middlewares";
import { usersController } from "../Controllers/usersController";

export const usersRouter = Router()

usersRouter.get(SETTINGS.PATH.USERS.ROOT,
    authMiddleware,
    usersController.getUsers.bind(usersController)

)

usersRouter.post(SETTINGS.PATH.USERS.ID,
    authMiddleware, 
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMiddleware,
    usersController.createUser.bind(usersController)
)

usersRouter.delete(SETTINGS.PATH.USERS.ID,
    authMiddleware,
    usersController.deleteUserById.bind(usersController)
)