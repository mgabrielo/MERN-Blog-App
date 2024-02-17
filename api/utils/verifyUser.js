import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token
    if (!token) {
        return next(errorHandler(401, 'Not authorized'))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Not authorized'))
        }
        req.user = user
        next()
    })
}