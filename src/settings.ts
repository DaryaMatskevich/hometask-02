import { config } from "dotenv";

config();


export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        USERS: '/users',
        COMMENTS: '/comments'
    },
    DB_NAME: process.env.DB_NAME || 'blog-platform',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '125',
}

export const ADMIN_AUTH = 'admin:qwerty';
 