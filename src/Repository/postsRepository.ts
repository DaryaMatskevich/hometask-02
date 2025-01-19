import { PostViewModel } from "../types/PostsViewModel";
import { blogs } from "./blogsRepository";

export let posts: PostViewModel = []

export function clearPostsData(): void {
    posts = [];
}

export const postsRepository = {

    findPosts() {
        return posts;
    },

    findPostById(id: string) {
        let post = posts.find(post => post.id === id)
        return post;
    },

    createPost(title: string, shortDescription: string, content: string, blogId: string) {

        const findBlogName = (blogId: string) : string  => {
            const blog = blogs.find(blog => blog.id === blogId)
            if (blog) {
                const foundblogName = blog.name
                return foundblogName;
            } else {
                return "not found"
            }
        }

        const newPost = {
        id: (new Date()).toString(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId,
        blogName: findBlogName(blogId)
    };
    posts.push(newPost);
    return newPost;
},

    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        let post = posts.find(post => post.id === id)
        if (post) {
            post.title = title;
            post.shortDescription = shortDescription;
            post.content = content;
            post.blogId = blogId;
            return true
        } else {
            return false
        }
    },

        deletePostById(id: string) {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === id) {
            posts.splice(i, 1);
            return true;
        }
    }
    return false
}
}
