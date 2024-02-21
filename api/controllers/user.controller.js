import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'

export const updateUser = async (req, res, next) => {
    if (req.user?.id !== req.params.userId) {
        return next(errorHandler(401, 'Not authorized'))
    }
    if (req.body.password?.length < 6) {
        return next(errorHandler(401, 'Password length must be at least 6 Characters'))
    }
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10)
    }
    const username = req.body.username
    if (username) {
        if (username.length < 7 || username.length > 20) {
            return next(errorHandler(401, 'username must be between 7 and 20 Characters'))
        }

        if (username.includes(' ')) {
            return next(errorHandler(401, 'username must not include spaces'))
        }

        if (username !== req.body.username.toLowerCase()) {
            return next(errorHandler(401, 'username must include only lowercase'))
        }

        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(401, 'username must include only letters and numbers'))
        }
    }
    try {
        const existedUser = await User.findById(req.params.userId)

        if (existedUser) {
            const existingUser = existedUser && await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body?.email ? username : existedUser._doc.username,
                    email: req.body?.email ? req.body?.email : existedUser._doc.email,
                    profilePicture: req.body?.profilePicture ? req.body?.profilePicture : existedUser._doc.profilePicture,
                    password: req.body?.password ? req.body?.password : existedUser._doc.password,
                }
            }, { new: true })

            const { password: pass, ...updateUser } = existingUser._doc
            res.status(200).json({ user: updateUser })
        }
    } catch (error) {
        return next(error)

    }

}

export const deleteUser = async (req, res, next) => {
    if (req.user?.id !== req.params.userId && !req.user.isAdmin) {
        return next(errorHandler(401, 'Not authorized'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.clearCookie('auth_token').status(200).json({ message: 'User Deleted Successfully' })
    } catch (error) {
        return next(error)

    }
}

export const logOutUser = async (req, res, next) => {
    if (req.user?.id !== req.params.userId) {
        return next(errorHandler(401, 'Not authorized'))
    }
    try {
        res.clearCookie('auth_token').status(200).json({ message: 'User Signed out Successfully' })
    } catch (error) {
        return next(error)

    }
}
export const getUserById = async (req, res, next) => {
    if (!req.params.userId) {
        return next(errorHandler(401, 'Not authorized'))
    }
    try {
        const existingUser = await User.findById(req.params.userId).select('-password');
        if (!existingUser) {
            return next(errorHandler(404, 'User Not Found'))
        }
        res.status(200).json({ user: existingUser })
    } catch (error) {
        return next(error)

    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user?.isAdmin) {
        return next(errorHandler(401, 'Not authorized'))
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const users = await User.find().sort({ createdAt: sortDirection }).skip(startIndex).limit(limit).select('-password')
        const userCount = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })
        res.status(200).json({
            users,
            userCount,
            lastMonthUsers
        })

    } catch (error) {
        return next(error)

    }
}