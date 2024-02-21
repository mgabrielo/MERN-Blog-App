import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

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

export const getPosts = async (req, res, next) => {

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const query = {};
        if (req.query.userId) query.userId = req.query.userId;
        if (req.query.category) query.category = req.query.category;
        if (req.query.slug) query.slug = req.query.slug;
        if (req.query.postId) query._id = req.query.postId;
        if (req.query.searchTerm) {
            query.$or = [
                { title: { $regex: req.query.searchTerm, $options: 'i' } },
                { content: { $regex: req.query.searchTerm, $options: 'i' } },
            ];
        }
        const posts = await Post.find(query).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit)
        const totalPosts = await Post.countDocuments();
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthsPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthsPosts
        })
    } catch (error) {
        return next(error)

    }
}

export const deletePost = async (req, res, next) => {
    if (!req.user?.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(401, 'Not authorized'))
    }
    try {
        await Post.findByIdAndDelete(req.params.postId)
        res.status(200).json({ message: 'Post Deleted Successfully' })
    } catch (error) {
        return next(error)

    }
}
export const updatePost = async (req, res, next) => {
    if (!req.user?.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(401, 'Not authorized'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'All Fields Required'))
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
            }
        }, { new: true })
        res.status(200).json({ message: 'Post Updates Successfully', post: updatedPost })

    } catch (error) {
        return next(error)

    }
}