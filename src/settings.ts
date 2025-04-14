import { config } from "dotenv";

config();


export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: {
            ROOT: '/blogs',
            ID: '/blogs/:id',
            ID_POSTS: '/blogs/:id/posts'
        },
        POSTS: {
            ROOT: '/posts',
            ID: '/posts/:id',
            ID_COMMENTS: '/posts/:id/comments'

        },
        USERS: {
            ROOT: '/users',
            ID: '/users/:id'
        },
        COMMENTS: {
            ROOT: '/comments',
            ID: '/comments/:id'
        },
        DEVICES: {
            ROOT: '/security/devices',
            ID: '/security/devices/:id'
        },
        REQUEST_COUNT: '/apiRequestCount',
        TESTING: '/testing',
        AUTH: {
            ROOT: '/auth',
            LOGIN: '/auth/login',
            REGISTRATION: '/auth/registration',
            REGISTRATION_CONFIRMATION: '/auth/registration-confirmation',
            REGISTRATION_EMAIL_RESENDING: 'auth/registration-email-resending',
            REFRESH_TOKEN: '/auth/refresh-token',
            LOGOUT: '/auth/logout',
            PASSWORD_RECOVERY: '/auth/password-recovery',
            NEW_PASSWORD: '/auth/new-password',
            ME: '/auth/me'
        }
    },
    DB_NAME: process.env.DB_NAME || 'blog-platform',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '125',
}

export const ADMIN_AUTH = 'admin:qwerty';
