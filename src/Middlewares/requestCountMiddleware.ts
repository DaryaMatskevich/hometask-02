import { NextFunction, Request, Response } from "express"
import { apiRequestCountCollection } from "../Repository/db";

const firstRequestTimeMap = new Map<string, number>();


export const requestCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip;
    const URL = req.originalUrl;
    const key = `${IP}-${URL}`; 
    const currentTime = new Date();
    const timeLimit = new Date(currentTime.getTime() - 10000)

    await apiRequestCountCollection.deleteMany({
        date: { $lt: timeLimit },
    });

    await apiRequestCountCollection.insertOne({ IP, URL, date: currentTime })

    const requestCount = await apiRequestCountCollection.countDocuments({
        IP,
        URL,
        date: { $gte: timeLimit },
    })



    if (requestCount > 5) {
        const firstRequestTime = firstRequestTimeMap.get(key) || currentTime.getTime()
        const timeElapsed = currentTime.getTime() - firstRequestTime;

        if (timeElapsed < 10000) {
            // Ждем оставшееся время
            const delay = 10000 - timeElapsed;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        // Сбрасываем время первого запроса
        firstRequestTimeMap.set(key, currentTime.getTime());

        // Возвращаем 429, если лимит превышен
        res.sendStatus(429);
        return;
    } else {
        // Если это первый запрос, сохраняем время
        if (!firstRequestTimeMap.has(key)) {
            firstRequestTimeMap.set(key, currentTime.getTime());
        }

        // Продолжаем обработку запроса
        next();
    }
};