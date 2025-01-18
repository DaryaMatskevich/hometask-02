import { BlogViewModel } from "../types/BlogsViewModel";

export let blogs: BlogViewModel = []


export const blogsRepository = {

  findAllBlogs() {
    const allBlogs = blogs;
    return blogs;
  },

  findBlogById(id: string) {
    let blog = blogs.find(blog => blog.id === id)
    return blog;
  },

  createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog = {
      id: new Date().toString(),
      name: name,
      description: description,
      websiteUrl: websiteUrl

    }
    blogs.push(newBlog)
    return newBlog;
  },

  updateBlog(id: string, name: string, description: string, websiteUrl: string) {
    let blog = blogs.find(blog => blog.id === id)
    if (blog) {
      blog.name = name;
      blog.description = description;
      blog.websiteUrl = websiteUrl;
      return true
    } else {
      return false
    }
  },

  deleteBlog(id: string) {
    for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].id === id) {
        blogs.splice(i, 1);
        return true;
      }
    }
    return false
  }
}

