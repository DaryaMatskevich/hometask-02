import "reflect-metadata"
import { Container } from "inversify";
import { BlogsController } from "./Controllers/blogsController";
import { UsersController } from "./Controllers/usersController";
import { BlogsService } from "./domain/blogs-service";
import { PostsService } from "./domain/posts-service";
import { UsersService } from "./domain/users-service";
import { BlogsRepository } from "./Repository/blogsRepository";
import { PostsRepository } from "./Repository/postsRepository";
import { UsersRepository } from "./Repository/usersRepository";
import { UsersQueryRepository } from "./queryRepository/usersQueryRepository";
import { EmailManager } from "./managers/email-manager";
import { BcryptService } from "./adapters/bcrypt-service";
import { AuthService } from "./domain/auth-service";
import { JwtService } from "./adapters/jwt-service";
import { SecurityDevicesServiсe } from "./domain/securityDevices-service";
import { SecurityDevicesQueryRepository } from "./queryRepository/securityDevicesQueryRepository";
import { SecurityDevicesController } from "./Controllers/securityDevicesController";
import { SecurityDevicesRepository } from "./Repository/securityDevicesRepository";


const objects: any[] = []


const blogsRepository = new BlogsRepository()
objects.push(blogsRepository)
const postsRepository = new PostsRepository()
objects.push(postsRepository)
const blogsService = new BlogsService(blogsRepository)
objects.push(blogsService)
const postsService = new PostsService(postsRepository)
objects.push(postsService)
const blogsController = new BlogsController(blogsService, postsService)
objects.push(blogsController)

export const ioc = {
    getInstance<T>(ClassType: any) {
        const targetInstance = objects.find(o => o instanceof ClassType)
    return targetInstance as T
    }
}



export const container = new Container()

container.bind(EmailManager).to(EmailManager)
container.bind(AuthService).to(AuthService)
container.bind(JwtService).to(JwtService)
container.bind(BcryptService).to(BcryptService)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(UsersQueryRepository).to(UsersQueryRepository)

container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(SecurityDevicesServiсe).to(SecurityDevicesServiсe)
container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository)
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository)