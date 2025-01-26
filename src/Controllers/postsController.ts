import { Request, Response, Router } from "express"
import { postsRepository } from "../Repository/postsRepository"
import { authMiddleware } from "../Middlewares/authMiddleware"
import { blogIdValidation, contentValidation, inputValidationMiddleware, shortDescriptionValidation, titleValidation } from "../Middlewares/middlewares"

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const foundPosts = await postsRepository.findPosts()
    res.send(foundPosts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    let post = await postsRepository.findPostById(req.params.id)
    if (post) {
        res.status(200).send(post)
    }
    else { res.sendStatus(404) }
})

postsRouter.post('/', authMiddleware, blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = await postsRepository.createPost(title, shortDescription, content, blogId);
    res.status(201).send(newPost)
})

postsRouter.put('/:id', authMiddleware, blogIdValidation, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, async (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    let isUpdated = await postsRepository.updatePost(req.params.id, title, shortDescription, content, blogId)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}
)

postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isDeleted = await postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    }
    res.sendStatus(404)
})

