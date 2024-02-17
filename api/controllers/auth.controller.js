import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { errorHandler } from "../utils/error.js"
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (!username || username == '' || !email || email == '' || !password || password == '') {
            next(errorHandler(400, 'All Fields Required'))
        }
        const hashedPassword = bcrypt.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save();
        return res.json({ msg: 'sign up successful' })
    } catch (error) {
        next(error)
    }
}


export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || email == '' || !password || password == '') {
            next(errorHandler(400, 'All Fields Required'))
        }
        const validUser = await User.findOne({ email });
        if (!validUser) {
            next(errorHandler(403, 'User Unauthorised'))
            return
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (validPassword == false) {
            next(errorHandler(403, 'User Unauthorised'))
            return
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        const { password: pass, ...signedUser } = validUser._doc
        res.status(200).cookie('auth_token', token, { httpOnly: true }).json({ user: signedUser })
    } catch (error) {
        next(error)
    }
}

export const googleSignIn = async (req, res, next) => {
    try {
        const { name, email, googlePhotoURL } = req.body
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            const { password: pass, ...signedUser } = existingUser._doc
            res.status(200).cookie('auth_token', token, { httpOnly: true }).json({ user: signedUser })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: generatedPassword,
                profilePicture: googlePhotoURL
            })
            await newUser.save()
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            const { password: pass, ...signedUser } = newUser._doc
            res.status(200).cookie('auth_token', token, { httpOnly: true }).json({ user: signedUser })
        }
    } catch (error) {
        next(error)
    }
}