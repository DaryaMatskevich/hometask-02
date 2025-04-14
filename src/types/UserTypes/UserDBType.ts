import { ObjectId } from "mongodb";

export type UserDBType = {
    _id: ObjectId
    login: string
    email: string
    createdAt: string
    };

    export class UserDbType {
        constructor(
            public _id: ObjectId,
            public login: string,
            public email: string,
            public password: string,
            public createdAt: Date,
            public confirmationCode: string,
            public expirationDate: Date,
            public isConfirmed: boolean){}
    }