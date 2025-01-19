import { Request, Response, Router } from "express"
import { postsRepository } from "../Repository/postsRepository"
import { authMiddleware } from "../Middlewares/authMiddleware"
import { contentValidation, inputValidationMiddleware, shortDescriptionValidation, titleValidation } from "../Middlewares/middlewares"

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts = postsRepository.findPosts()
    res.send(foundPosts)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    let post = postsRepository.findPostById(req.params.id)
    if (post) {
        res.sendStatus(200).send(post)
    }
    else { res.sendStatus(404) }
})

postsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware, (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = postsRepository.createPost(title, shortDescription, content, blogId);
    res.status(201).send(newPost)
})

postsRouter.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    let isUpdated = postsRepository.updatePost(req.params.id, title, shortDescription, content, blogId)
    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.send(404)
    }
}
)

postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    const isDeleted = postsRepository.deletePostById(req.params.id)
    if (isDeleted) {
        res.send(204)
    }
    res.send(404)
})

