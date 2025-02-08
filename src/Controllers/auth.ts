import { Request, Response, Router } from "express";
import { loginValidation, passwordValidation } from "../Middlewares/middlewares";

export const authRouter = Router({})

authRouter.post('/', loginValidation, passwordValidation, async (req: Request, res: Response): Promise<any> => {
    const {loginOrEmail, password} = req.body;
      return res.sendStatus(204)
    })
    