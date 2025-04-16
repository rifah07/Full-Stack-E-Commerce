import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './handler/errorHandler';
import  userRoutes  from './modules/users/users.routes';


dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//models initialization
//require("./models/users.model");


//add routes here
app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send('Server started successfully!');
});

// Error handler middleware
app.use(errorHandler);

export default app;
