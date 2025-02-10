import { ObjectId } from "mongodb";

export type UserDBType = {
    _id: ObjectId
    login: string
    email: string
    password: string
    createdAt: string
    };