import { ObjectId } from "mongodb";

export type UserDBType = {
    login: string
    email: string
    password: string,
    createdAt: string,
    confirmationCode: string,
    recoveryCodeExpirationDate: Date,
    expirationDate: Date,
    isConfirmed: boolean
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