import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import router from './routes/routes.js';
import userRouter from './routes/userRouts.js';


const app = express()
const port = process.env.port || 3000
connectDB()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins ,credentials:true}));
//API endpoints
app.get('/', (req, res)=>{
    res.send('API WORKING')
})
app.use('/api/auth', router)
app.use('/api/user', userRouter)


app.listen(port, ()=>console.log(`server started on PORT : http://localhost:${port}`))