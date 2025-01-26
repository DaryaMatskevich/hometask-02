import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogViewModel } from "../types/BlogsViewModel";
import { PostViewModel } from "../types/PostsViewModel";
import * as dotenv from 'dotenv'

dotenv.config()

export let blogsCollection: Collection<BlogViewModel>
export let postsCollection: Collection<PostViewModel>

export async function runDb(url: string): Promise<boolean> {

    let client = new MongoClient(url);
    let db = client.db(SETTINGS.DB_NAME)

    blogsCollection = db.collection<BlogViewModel>(SETTINGS.PATH.BLOGS)
    postsCollection = db.collection<PostViewModel>(SETTINGS.PATH.POSTS)


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
