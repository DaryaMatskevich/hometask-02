import { NextFunction, Request, Response } from "express";
import { ADMIN_AUTH } from '../settings.js'
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

    let data = ADMIN_AUTH;
    let base64data = Buffer.from(data).toString('base64');

    const validAuthValue = `Basic ${base64data}`
    let authHeader = req.headers.authorization

    if (authHeader && authHeader === validAuthValue) {

        next()
    }

    else {
        res.sendStatus(401)
    }
}