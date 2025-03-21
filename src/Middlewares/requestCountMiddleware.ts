import { NextFunction, Request, Response } from "express"
import { apiRequestCountCollection } from "../Repository/db";



export const requestCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip;
    const URL = req.originalUrl;
  
    const currentTime = new Date();
    const timeLimit = new Date(currentTime.getTime() - 10000)

    // await apiRequestCountCollection.deleteMany({
    //     IP,
    //     URL,
    //     date: { $lt: timeLimit },
    // });

    await apiRequestCountCollection.insertOne({ IP, URL, date: currentTime })

    let requestCount = await apiRequestCountCollection.countDocuments({
        IP,
        URL,
        date: { $gte: timeLimit },
    })


// if(requestCount = 1) {
//     res.sendStatus
// }
    if (requestCount > 5) {
        res.sendStatus(429);
        return;
    } else {

        next();
    }
};