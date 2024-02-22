import Comment from "../models/comment.model.js"
import { errorHandler } from "../utils/error.js"

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body
        if (req.user?.id !== userId && !postId) {
            return next(errorHandler(401, 'Not authorized'))
        }
        const newComment = await new Comment({
            content,
            postId,
            userId
        })

        await newComment.save()
        res.status(200).json({ comment: newComment })
    } catch (error) {
        next(error)
    }
}
export const getPostComment = async (req, res, next) => {
    try {
        if (!req.params.postId) {
            return next(errorHandler(401, 'Not authorized'))
        }
        const existingComments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 })
        res.status(200).json({ comments: existingComments })
    } catch (error) {
        next(error)
    }
}
export const getComments = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return next(errorHandler(401, 'Not authorized'))
        }
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        const existingComments = await Comment.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit)
        const totalComments = await Comment.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            comments: existingComments,
            totalComments,
            lastMonthComments
        })
    } catch (error) {
        next(error)
    }
}
export const editComment = async (req, res, next) => {
    try {
        if (!req.params.commentId) {
            return next(errorHandler(401, 'Not authorized'))
        }
        const existingComment = await Comment.findById(req.params?.commentId)
        if (!existingComment) {
            return next(errorHandler(404, 'Comment Not Found'))
        }
        if (existingComment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(404, 'Action Not Allowed'))
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, { content: req.body.content }, { new: true })
        res.status(200).json({ comment: editedComment })
    } catch (error) {
        next(error)
    }
}
export const deleteComment = async (req, res, next) => {
    try {
        if (!req.params.commentId) {
            return next(errorHandler(401, 'Not authorized'))
        }
        const existingComment = await Comment.findById(req.params?.commentId)
        if (!existingComment) {
            return next(errorHandler(404, 'Comment Not Found'))
        }
        if (existingComment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(404, 'Action Not Allowed'))
        }
        await Comment.findByIdAndDelete(req.params.commentId)
        res.status(200).json({ message: 'Comment Deleted Successfully' })
    } catch (error) {
        next(error)
    }
}
export const likeComment = async (req, res, next) => {
    try {
        if (!req.params.commentId) {
            return next(errorHandler(401, 'Not authorized'))
        }
        const existingComment = await Comment.findById(req.params?.commentId)
        if (!existingComment) {
            return next(errorHandler(404, 'Comment Not Found'))
        }
        const userIndex = existingComment.likes.indexOf(req.user.id);
        if (userIndex == -1) {
            existingComment.numberOfLikes += 1
            existingComment.likes.push(req.user.id)
        } else {
            existingComment.numberOfLikes -= 1
            existingComment.likes.splice(userIndex, 1)
        }
        await existingComment.save()
        res.status(200).json({ comment: existingComment })
    } catch (error) {
        next(error)
    }
}