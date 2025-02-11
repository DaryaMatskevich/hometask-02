import { UserAuthType } from "./UserTypes/UserAuthType"

declare global {
    declare namespace Express {
        export interface Request {
            user: UserAuthType | null
        }
    }
}