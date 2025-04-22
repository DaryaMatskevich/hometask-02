import { app } from "./app";
import { runDb } from "./Repository/db";
import { SETTINGS } from "./settings";


const startApp = async () => {

    await runDb()
    app.listen(SETTINGS.PORT, () => {
        console.log('Server started in port ' + SETTINGS.PORT)
    })
}

    // const res = await runDb(SETTINGS.MONGO_URL)
    // if (!res) process.exit(1)

startApp()

// app.set('trust proxy', true)