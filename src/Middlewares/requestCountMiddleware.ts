import { NextFunction, Request, Response } from "express"
import { apiRequestCountCollection } from "../Repository/db";

export const requestCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip;
    const URL = req.originalUrl;
    const currentTime = new Date()

        const timeLimit = new Date(Date.now() - 10000)
 

    await apiRequestCountCollection.bulkWrite([
        {deleteMany: {filter:{
            IP,
            URL,
            date: { $lt: timeLimit } }}},
        {insertOne: {document: { IP, URL, date: currentTime }}}
        ])

    let requestCount = await apiRequestCountCollection.countDocuments({
        IP,
        URL,
        date: { $gte: timeLimit },
    })
    
    if (requestCount > 5) {
        res.sendStatus(429);
        return;
    } else {
        next();
    }
};