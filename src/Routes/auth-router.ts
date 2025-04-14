import { Router } from "express";
import { SETTINGS } from "../settings";
import { emailValidation, inputValidationMiddleware, loginValidation, newPasswordValidation, passwordValidation } from "../Middlewares/middlewares";
import { authController} from "../Controllers/authController";
import { requestCountMiddleware } from "../Middlewares/requestCountMiddleware";
import { userAuthMiddleware } from "../Middlewares/userAuthMiddleware";

export const authRouter = Router()

authRouter.post(SETTINGS.PATH.AUTH.LOGIN, 
    requestCountMiddleware,
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    authController.login.bind(authController)
)

authRouter.get(SETTINGS.PATH.AUTH.ME,
    userAuthMiddleware,
    authController.me.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.REGISTRATION,
    requestCountMiddleware,
    loginValidation,
    emailValidation,
    passwordValidation,
    inputValidationMiddleware,
    authController.registration.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.REGISTRATION_CONFIRMATION,
    requestCountMiddleware,
    authController.registrationConfirmation.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.REGISTRATION_EMAIL_RESENDING,
    requestCountMiddleware,
    authController.registrationEmailResending.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.REFRESH_TOKEN,
    authController.refreshToken.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.LOGOUT,
    authController.logout.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.PASSWORD_RECOVERY,
    requestCountMiddleware,
    emailValidation,
    inputValidationMiddleware,
    authController.passwordRecovery.bind(authController)
)

authRouter.post(SETTINGS.PATH.AUTH.NEW_PASSWORD,
    requestCountMiddleware,
    newPasswordValidation,
    inputValidationMiddleware,
    authController.newPassword.bind(authController)
)