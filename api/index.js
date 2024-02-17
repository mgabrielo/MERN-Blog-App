import express from "express";
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser());

const port = 5000
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDb is Connected')
}).catch((err) => {
    console.log(err)
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
app.listen(port, () => {
    console.log(`server running on ${port} !!!`)
})