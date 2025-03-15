import { NextFunction, Request, Response } from "express"
import { apiRequestCountCollection } from "../Repository/db";

export const requestCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   const IP = req.ip;
   const URL = req.originalUrl;
   const date = new Date();

   await apiRequestCountCollection.insertOne({IP, URL, date})

   const filter = {
    IP,
    URL, 
    date: {$gte: new Date(date.getTime()-10000)} 
   }

const requestCount = await apiRequestCountCollection.countDocuments(filter)

if(requestCount>5)  {
    res.sendStatus(429)
    return
}

    next()

}