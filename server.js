import express from 'express';
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan';
import connectDB from './db/connect.js';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

// routers
import authRouter from './routes/authRoutes.js';
import researchRouter from './routes/researchRoutes.js';

// import for default view

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


const port = process.env.PORT || 5100;

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/research', researchRouter)

app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, 'index.html'));
})

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, ()=> {
            console.log(`server is running on ${port}....`)
        }); 
    }

    catch(error) {
        console.log(error)
    }
}

start();