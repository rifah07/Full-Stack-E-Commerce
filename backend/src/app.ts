import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { morganStream } from "./utils/logger";
import errorHandler from "./handler/errorHandler";
import userRoutes from "./modules/users/users.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Morgan HTTP logging into Winston
app.use(morgan("combined", { stream: morganStream }));

//models initialization
//require("./models/users.model");

//add routes here
app.use("/api/users", userRoutes);

//end of routes

/*
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Not Found!",
  });
});
*/

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server started successfully!");
});

app.listen(5000, () => {
  console.log("Server started successfully");
});

export default app;