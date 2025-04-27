Installation commands:

1. npm init -y/ npm init
2. npm install express mongoose dotenv zod jsonwebtoken bcryptjs cors cookie-parser
3. npm install --save-dev typescript ts-node-dev @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken
4. npx tsc --init
5. npm install --save-dev nodemon ts-node
6. npm install nodemailer
7. npm install --save-dev @types/nodemailer
8. npm install zod  # For Zod
9. npm install yup  # For Yup
10. npm install winston
11. npm install --save-dev @types/morgan


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
33. To reset password with code in email create new file as: 'resetPassword.ts"
34. Add in routes and check with api as POST: "http://localhost:5000/api/users/reset-password?token=2e77cf91799958c14a5cdbc6f57776ee9854b0a93f55947b9fad5e91979cf8d8", body: newPassword.
35. Add authMiddleware in routes, after uodating the auth file.
36. Update in jwtManager, authMiddleware and implement changePassword.
37. Add in routes, add changePassword route after auth route.
38. Save and check in postman with api: POST: "http://localhost:5000/api/users/change-password".
39. In POSTMAN, select "Authorization"> 'Bearer Token"(paste token from login) to test.
40. So, user registration, verification, verification resend if while registration not verified, login, reset forgotten password, change password are working perfectly now, Alhamdulillah.
41. Now Schema Validation: Zod or Yup.
42. Install point 8/9 above, as you prefer, I choose 8.
43. Update users.model.ts with zod or yup, I'm using Zod.
44. Update register.ts with zod schema and check again. It should work.
45. To cestralize schemas, add all zod schemas in validator>user.validator.ts .
46. Add register schema, login schema ... in user.validator.
47. Change parts with zodSchema(s).
48. View profile , edit profile, delete profile added.
49. Middleware updated, now chose "No auth" instead of "Bearer toekn" in authorization in postman.
50. Logout updated, all are working now, Alhamdulillah.
51. In terminal, type point-10 above.
52. Install winston like 51 point and add logger.ts file in utils folder.
53. In terminal, type point-11 above.
54. Morgan is a HTTP request logger middleware for Node.js that provides clear visibility into the incoming HTTP traffic. Combined with winston: Save HTTP request logs to files, Separate info, error, and warning logs.
55. Install morgan like 53 point.
56. Add a new code AppError.ts, to centralize error with message and status code
57. Ass AppError in files to lessen res.status much.
58. Update errorandler too.
59. Add error.ts in utils folder, for cleaner controller code and standardized error responses.
60. Update codes of controllers now with updated error.ts extended from AppError.
61. Add catchAsync.ts in utils to centralize errors of try catch and updae controller codes in users by removing try,catch and update eith catchAsync.
62. Update errorHandler, catchAsync and some files.
63. Auth middleware updared and authorize.ts added for checking role.
64. Implement ban , unban User by admin after role authenticating.
65. Implement get all users to see admin all users.
66. Now move to product module. 
67. In models folder add products.model.ts. And write code in it with DB schema