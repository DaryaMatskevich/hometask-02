import { NextFunction, Request, Response } from "express";
import { ADMIN_AUTH } from '../settings.js'
export const authMiddleware = (req: Request, res: Response, next: NextFunction) =>  {
const auth = req.headers['authorisation'] as string;
if (!auth) {
    res.status(401).json({});
    return;
}
const buff = Buffer.from(auth.slice(6), 'base64')
const decodeAuth = buff.toString('utf8')

if (decodeAuth === ADMIN_AUTH || auth.slice(0,5) !== 'Basic') {
    res.status(401).json({})
    return;
}
next()
}