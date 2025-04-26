import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/connect.js';
import cors from 'cors';
import authMiddleware from './middleware/authMiddleware.js';

import authRouter from './routes/authRoutes.js';
import researchRouter from './routes/researchRoutes.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';

// import for default view
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 5100;

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/research', authMiddleware, researchRouter);
app.use('/api/v1/users', authMiddleware, userRouter);
app.use('/api/v1/chat', authMiddleware, chatRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start(); 
