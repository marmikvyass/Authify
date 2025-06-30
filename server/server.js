import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import router from './routes/routes.js';
import userRouter from './routes/userRouts.js';


const app = express()
const port = process.env.PORT || 3000
connectDB()

const allowedOrigins = [
    'http://localhost:5173',
    'https://authify-flax.vercel.app'
]

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}))
//API endpoints
app.get('/', (req, res)=>{
    res.send('API WORKING')
})
app.use('/api/auth', router)
app.use('/api/user', userRouter)


app.listen(port, ()=>console.log(`server started on PORT : ${port}`))
