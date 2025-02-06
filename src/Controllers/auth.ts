import { Router } from "express";
import { loginValidation, passwordValidation } from "../Middlewares/middlewares";

export const authRouter = Router({})

// authRouter.post('/', loginValidation, passwordValidation, async (req: Request, res: Response) => {
//     const {loginOrEmail, password} = req.body;
//       return res.status(201).json(newUser!)
//     })
    