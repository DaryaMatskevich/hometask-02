import { config } from "dotenv";

config();


export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: {
            ROOT: '',
            ID: '/:id',
            ID_POSTS: '/:id/posts'
        },
        POSTS: {
            ROOT: '',
            ID: '/:id',
            ID_COMMENTS: '/:id/comments'

        },
        USERS: {
            ROOT: '',
            ID: '/:id'
        },
        COMMENTS: {
            ROOT: '',
            ID: '/:id',
            ID_LIKE_STATUS: '/:id/like-status'
        },
        DEVICES: {
            ROOT: '/devices',
            ID: '/devices/:id'
        },
        REQUEST_COUNT: '/apiRequestCount',
        TESTING: '/testing',
        AUTH: {
            ROOT: '',
            LOGIN: '/login',
            REGISTRATION: '/registration',
            REGISTRATION_CONFIRMATION: '/registration-confirmation',
            REGISTRATION_EMAIL_RESENDING: '/registration-email-resending',
            REFRESH_TOKEN: '/refresh-token',
            LOGOUT: '/logout',
            PASSWORD_RECOVERY: '/password-recovery',
            NEW_PASSWORD: '/new-password',
            ME: '/me'
        }
    },
    DB_NAME: process.env.DB_NAME || 'blog-platform',
    MONGO_URL: process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${process.env.DB_NAME}`,
    JWT_SECRET: process.env.JWT_SECRET || '123',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '125',
}

export const ADMIN_AUTH = 'admin:qwerty';
