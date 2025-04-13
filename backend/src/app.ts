import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './handler/errorHandler';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//add routes here

app.get('/', (req, res) => {
  res.send('Server started successfully!');
});

// Error handler middleware
app.use(errorHandler);

export default app;
