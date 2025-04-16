Installation commands:

1. npm init -y/ npm init
2. npm install express mongoose dotenv zod jsonwebtoken bcryptjs cors cookie-parser
3. npm install --save-dev typescript ts-node-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
4. npx tsc --init
5. npm install --save-dev nodemon ts-node
6. npm install nodemailer
7. npm install --save-dev @types/nodemailer


Steps:

1. Install the first 5 packages and create a file in the project directory as "app.ts" (entry point: I choose app.ts)
2. Go to "package.json" and in "scripts" add "," at end of 'test" line and add new line as->  "dev": "nodemon",
    "build": "tsc",

    "start": "node dist/server.js",

    "clean": "rm -rf dist"

3. Add tsconfig.json, copy paste the cose you can see in the file.
4. create the project directory like: 

backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── db.ts
│   ├── handler/
│   │   └── errorHandler.ts
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   └── utils/
├── .env
├── .gitignore
└── .example.env
├── nodemon.json
├── tsconfig.json
└── package.json

5. Add codes in nodemon.json as you see here.
6. Add codes in server.ts, app.ts,.env, config>db.ts as you see here.
7. Set up user model-> src/models/User.ts:src/models/User.ts.
8. Update User.ts as necessary, see in code file.
9. Install 6, 7 commands in your terminal.
10. Add files for Sign Up feature.
11. Add email sending code in managers/emailManager.ts and update env as inj .example.env (those info are in your mailtrap account; go https://mailtrap.io/inboxes/3556852/messages and see in 'Integration' part).
12. Add new folder names modules/users/controller folders for users controller.
13. Inside above folder add register.ts and add code in it.
14.   