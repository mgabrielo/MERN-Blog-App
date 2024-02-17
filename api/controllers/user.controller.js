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
            existingUser.save()
            const { password: pass, ...updateUser } = existingUser._doc
            res.status(200).json({ user: updateUser })
        }
    } catch (error) {
        return next(error)

    }

}