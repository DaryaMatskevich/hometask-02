import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogViewType } from "../types/BlogTypes/BlogTypes";
import { PostViewType } from "../types/PostTypes/PostViewType";
import * as dotenv from 'dotenv'


dotenv.config()

export let blogsCollection: Collection<BlogViewType>
export let postsCollection: Collection<PostViewType>
export let usersCollection: Collection<any>
export let commentsCollection: Collection<any>
export let devicesCollection: Collection<any>
export let apiRequestCountCollection: Collection<any>

export async function runDb(url: string): Promise<boolean> {

    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME)

    blogsCollection = db.collection<BlogViewType>('/blogs')
    postsCollection = db.collection<PostViewType>('/posts')
    usersCollection = db.collection<any>('/users')
    commentsCollection = db.collection<any>('/comments')
    devicesCollection = db.collection<any>('/devices')
    apiRequestCountCollection = db.collection<any>('/apiRequestCount')
    

    try {
        await client.connect();
        await db.command({ ping: 1 })
        console.log("Connected successfully to mongo server")
        return true
    } catch (e) {
        console.log(e)
        await client.close();
        return false
    }
}
