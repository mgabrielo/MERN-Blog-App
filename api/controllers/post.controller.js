import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
    if (!req.user?.isAdmin) {
        return next(errorHandler(401, 'Not authorized'))
    }
    try {
        if (!req.body.title || !req.body.content) {
            return next(errorHandler(400, 'All Fields Required'))
        }
        const postSlug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        const newPost = new Post({
            slug: postSlug,
            userId: req.user.id,
            ...req.body
        })
        await newPost.save()
        res.status(200).json({ post: newPost })
    } catch (error) {
        return next(error)

    }
}