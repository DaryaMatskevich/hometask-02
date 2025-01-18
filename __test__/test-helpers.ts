import { app } from '../src/app'
import { agent } from "supertest";
import { blogs, clearBlogs } from '../src/Repository/blogsRepository'
import { posts, clearPosts } from '../src/Repository/postsRepository'
export const req = agent(app)

app.delete('/testing/all-data', (req, res) => {
    clearBlogs()
    clearPosts();
    res.sendStatus(204);
});