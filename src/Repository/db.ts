import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogViewType } from "../types/BlogTypes/BlogViewType";
import { PostViewType } from "../types/PostTypes/PostsViewType";
import * as dotenv from 'dotenv'

dotenv.config()

export let blogsCollection: Collection<BlogViewType>
export let postsCollection: Collection<PostViewType>
export let usersCollection: Collection<any>

export async function runDb(url: string): Promise<boolean> {

    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME)

    blogsCollection = db.collection<BlogViewType>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection<PostViewType>(SETTINGS.PATH.POSTS)
    usersCollection = db.collection<any>(SETTINGS.PATH.USERS)
    

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
