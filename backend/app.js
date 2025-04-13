const express = require("express");
//const cors = require("cors");
const mongoose = require("mongoose");
const errorHandler= require("./handler/errorHandler")

require("dotenv").config();

const app = express();
//app.use(cors());

//mongoose
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch(() => {
    console.log("Failed to connect database...");
  });

// models initialization

app.use(express.json());

//routes

//end of all routes

app.get("/", (req, res) => {
  res.send("Assalamu Alaikum");
});

app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server started successfully");
});