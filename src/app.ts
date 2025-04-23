import express from 'express'
import { blogsRouter } from './Routes/blogs-router'
import { postsRouter } from './Routes/posts-router'
import { clearBlogsData } from './Repository/blogsRepository'
import { clearPostsData } from './Repository/postsRepository'
import { usersRouter } from './Routes/users-router'
import { authRouter } from './Routes/auth-router'
import { clearUsersData } from './Repository/usersRepository'
import { commentsRouter } from './Routes/comments-router'
import { clearCommentsData } from './Repository/commentsRepository'
import cookieParser from 'cookie-parser'
import { sessionsRouter } from './Routes/sessions-router'


export const app = express()
app.use(express.json())

app.use(cookieParser())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', sessionsRouter)



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

