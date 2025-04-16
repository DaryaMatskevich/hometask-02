import "reflect-metadata"
import { Container } from "inversify";
import { UsersController } from "./Controllers/usersController";
import { BlogsService } from "./domain/blogs-service";
import { PostsService } from "./domain/posts-service";
import { UsersService } from "./domain/users-service";
import { BlogsRepository } from "./Repository/blogsRepository";
import { PostsRepository } from "./Repository/postsRepository";
import { UsersRepository } from "./Repository/usersRepository";
import { UsersQueryRepository } from "./queryRepository/usersQueryRepository";
import { AuthService } from "./domain/auth-service";
import { SecurityDevicesServiсe } from "./domain/securityDevices-service";
import { SecurityDevicesQueryRepository } from "./queryRepository/securityDevicesQueryRepository";
import { SecurityDevicesController } from "./Controllers/securityDevicesController";
import { SecurityDevicesRepository } from "./Repository/securityDevicesRepository";
import { CommentsQueryRepository } from "./queryRepository/commentsQueryRepository";
import { CommentsService } from "./domain/comments-service";
import { PostsController } from "./Controllers/postsController";
import { CommentsRepository } from "./Repository/commentsRepository";
import { BlogsController } from "./Controllers/blogsController";
import { CommentsController } from "./Controllers/commentsController";


const objects: any[] = []


const blogsRepository = new BlogsRepository()
objects.push(blogsRepository)

const blogsService = new BlogsService(blogsRepository)
objects.push(blogsService)

const postsRepository = new PostsRepository()
objects.push(postsRepository)

const postsService = new PostsService(postsRepository)
objects.push(postsService)

const commentsQueryRepository = new CommentsQueryRepository()
objects.push(commentsQueryRepository)

const commentsRepository = new CommentsRepository()
objects.push(commentsRepository)

const commentsService = new CommentsService(commentsRepository)
objects.push(commentsRepository)

const postsController = new PostsController(postsService, commentsQueryRepository, commentsService, postsRepository)
objects.push(postsController)

const blogsController = new BlogsController(blogsService, postsService)
objects.push(blogsController)

const commentsController = new CommentsController(commentsService, commentsQueryRepository)
objects.push(commentsController)


export const ioc = {
    getInstance<T>(ClassType: any) {
        const targetInstance = objects.find(o => o instanceof ClassType)
    return targetInstance as T
    }
}



export const container = new Container()

container.bind(AuthService).to(AuthService)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)

container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(SecurityDevicesServiсe).to(SecurityDevicesServiсe)
container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository)
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository)