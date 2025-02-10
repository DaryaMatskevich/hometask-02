import { UserDBType } from "./UserTypes/UserDBType"

declare global {
    declare namespace Express {
        export interface Request {
            user: UserDBType | null
        }
    }
}