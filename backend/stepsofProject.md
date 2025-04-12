Installation commands:

1. npm install express
2. npm init
3. npm install nodemon
4. npm install express-async-errors [It doesn't need now in 5.1.0 Express JS. So do not install now.]
5. npm install mongoose
6. npm install dotenv
7. npm i cors


Steps:

1. Install the first 3 packages and create a file in the project directory as "app.js" (entry point: I choose app.js)
2. Go to "package.json" and in "scripts" add "," at end of 'test" line and add new line for start as-> "start": "nodemon app.js".
3. Install number 5,6,7 command above, in your terminal.
4. Create an express app(const app, app.listen...), the code is in app.js 
5. In app.js (for reference)[->

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Assalamu Alaikum!");
});

app.listen(3000, () => {
  console.log("Server started successfully");
});
]

6. In terminal type "npm start" now go to "http://localhost:3000/" you should see message of app.get.
7. 