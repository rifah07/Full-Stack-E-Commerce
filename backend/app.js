const express = require("express");
//const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
//app.use(cors());


//mongoose


// models initialization

app.use(express.json());

//routes


//end of all routes




app.get("/", (req, res) => {
  res.send("Assalamu Alaikum");
});

app.listen(3000, () => {
  console.log("Server started successfully");
});
