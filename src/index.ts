import { app } from "./app";
import { blogsRouter } from "./Controllers/blogsController";
import { postsRouter } from "./Controllers/postsController";
import { SETTINGS } from "./settings";


app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.listen(SETTINGS.PORT, () => {
    console.log('...server started in port ' + SETTINGS.PORT)
})