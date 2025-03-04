import express from 'express'
import { blogsRouter } from './Controllers/blogsController'
import { postsRouter } from './Controllers/postsController'
import { clearBlogsData } from './Repository/blogsRepository'
import { clearPostsData } from './Repository/postsRepository'
import { usersRouter } from './Controllers/usersController'
import { authRouter } from './Controllers/authController'
import { clearUsersData } from './Repository/usersRepository'
import { commentsRouter } from './Controllers/commentsController'
import { clearCommentsData } from './Repository/commentsRepository'
import cookieParser from 'cookie-parser'


export const app = express()
app.use(express.json())

app.use(cookieParser())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)



app.get('/', (req, res) => {
    res.status(200).json({ version: '1.0' })
})

app.delete('/testing/all-data', async (req, res) => {
    await clearBlogsData();
    await clearPostsData();
    await clearUsersData();
    await clearCommentsData()
    res.sendStatus(204);
})

