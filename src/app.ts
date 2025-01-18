import express from 'express'
import { blogsRouter } from './Controllers/blogsController'
import { postsRouter } from './Controllers/postsController'


export const app = express()
app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)



app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

// app.delete('/testing/all-data', (req, res) => {
//     clearBlogs();
//     clearPosts();
//     res.sendStatus(204); 
// });