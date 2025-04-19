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
14. Add users.routes.ts file inside users folder and write route in it.
15. Update app.ts with route.
16. Go to postman and create new collection, add new request GET methode and check with "http://localhost:5000/"
17. Add new request POST with "http://localhost:5000/api/users/register" and test with these values :{
    "name": "Testing" ,

    "email": "testing@gmail.com",

    "password": "testing",

    "confirm_password": "testing",

    "role": "admin"
}

18. Update the users mode again and rehistration.ts, so that to verify he e-mail a code is sent in the email
19. Add verifyEmail.ts to verify the code for registration.
20. Add verifyEmail in user routes and check with api in postman "http://localhost:5000/api/users/verify-email?token=Your-Token-In-Mail-Here"
21. Add jwtManager.ts in managers folder and write cosde in it for accesstoken.
22. Add login.ts to implement login, code as in the file.
23. Add login in userRoutes and save all, test in postman with this- "http://localhost:5000/api/users/login".
24. In middlewares folder add authMiddleware.ts to authenticate with access token add codes.
25. authMiddleware is added in routes but commented as we have not implemented following parts of it.
26. Add resendVerification.ts to resent verification token if missed previously. And add in routes.
27. Check this api for 26 point implementetion: "http://localhost:5000/api/users/resend-verification".
28. So now, implement forgot password problem.
29. Add 2 nre variables in users.model.
30. Add new file in controllers as forgotPassword.ts and write code in it.
31. Add in routes, test with api, POST "http://localhost:5000/api/users/forgot-password"
32. It should be working now.