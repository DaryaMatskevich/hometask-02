import { config } from "dotenv";

config();


export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users'
    },
    DB_NAME: process.env.DB_NAME || 'blog-platform',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
}

export const ADMIN_AUTH = 'admin:qwerty';
 