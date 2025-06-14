## Informal file 

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
12. npm install axios
13. npm install stripe
14. npm install @paypal/checkout-server-sdk
15. npm install moment
16. npm install express-rate-limit
17. npm install --save-dev @types/swagger-ui-express
18. npm install --save-dev @types/swagger-jsdoc



Steps:

1. Install the first 5 packages and create a file in the project directory as "app.ts" (entry point: I choose app.ts)
2. Go to "package.json" and in "scripts" add "," at end of 'test" line and add new line as->  "dev": "nodemon",
    "build": "tsc",

    "start": "node dist/server.js",

    "clean": "rm -rf dist"

3. Add tsconfig.json, copy paste the cose you can see in the file.
4. create the project directory as you see in repository.
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

1.  Update the users mode again and rehistration.ts, so that to verify he e-mail a code is sent in the email
2.  Add verifyEmail.ts to verify the code for registration.
3.  Add verifyEmail in user routes and check with api in postman "http://localhost:5000/api/users/verify-email?token=Your-Token-In-Mail-Here"
4.  Add jwtManager.ts in managers folder and write cosde in it for accesstoken.
5.  Add login.ts to implement login, code as in the file.
6.  Add login in userRoutes and save all, test in postman with this- "http://localhost:5000/api/users/login".
7.  In middlewares folder add authMiddleware.ts to authenticate with access token add codes.
8.  authMiddleware is added in routes but commented as we have not implemented following parts of it.
9.  Add resendVerification.ts to resent verification token if missed previously. And add in routes.
10. Check this api for 26 point implementetion: "http://localhost:5000/api/users/resend-verification".
11. So now, implement forgot password problem.
12. Add 2 nre variables in users.model.
13. Add new file in controllers as forgotPassword.ts and write code in it.
14. Add in routes, test with api, POST "http://localhost:5000/api/users/forgot-password"
15. It should be working now.
16. To reset password with code in email create new file as: 'resetPassword.ts"
17. Add in routes and check with api as POST: "http://localhost:5000/api/users/reset-password?token=2e77cf91799958c14a5cdbc6f57776ee9854b0a93f55947b9fad5e91979cf8d8", body: newPassword.
18. Add authMiddleware in routes, after uodating the auth file.
19. Update in jwtManager, authMiddleware and implement changePassword.
20. Add in routes, add changePassword route after auth route.
21. Save and check in postman with api: POST: "http://localhost:5000/api/users/change-password".
22. In POSTMAN, select "Authorization"> 'Bearer Token"(paste token from login) to test.
23. So, user registration, verification, verification resend if while registration not verified, login, reset forgotten password, change password are working perfectly now, Alhamdulillah.
24. Now Schema Validation: Zod or Yup.
25. Install point 8/9 above, as you prefer, I choose 8.
26. Update users.model.ts with zod or yup, I'm using Zod.
27. Update register.ts with zod schema and check again. It should work.
28. To cestralize schemas, add all zod schemas in validator>user.validator.ts .
29. Add register schema, login schema ... in user.validator.
30. Change parts with zodSchema(s).
31. View profile , edit profile, delete profile added.
32. Middleware updated, now chose "No auth" instead of "Bearer toekn" in authorization in postman.
33. Logout updated, all are working now, Alhamdulillah.
34. In terminal, type point-10 above.
35. Install winston like 51 point and add logger.ts file in utils folder.
36. In terminal, type point-11 above.
37. Morgan is a HTTP request logger middleware for Node.js that provides clear visibility into the incoming HTTP traffic. Combined with winston: Save HTTP request logs to files, Separate info, error, and warning logs.
38. Install morgan like 53 point.
39. Add a new code AppError.ts, to centralize error with message and status code
40. Ass AppError in files to lessen res.status much.
41. Update errorandler too.
42. Add error.ts in utils folder, for cleaner controller code and standardized error responses.
43. Update codes of controllers now with updated error.ts extended from AppError.
44. Add catchAsync.ts in utils to centralize errors of try catch and updae controller codes in users by removing try,catch and update eith catchAsync.
45. Update errorHandler, catchAsync and some files.
46. Auth middleware updared and authorize.ts added for checking role.
47. Implement ban , unban User by admin after role authenticating.
48. Implement get all users to see admin all users.
49. Now move to product module. 
50. In models folder add products.model.ts. And write code in it with DB schema.
51. Create a new folder insile modules as 'products', add products.route.ts and controllers foder inside products.
52. Insilde products>controllers add createProduct.ts to add a new product.
53. Also add a zod validator inside validators folder for products.
54. Add the create product in product routes and add routes file in app.ts.
55. You can check postman with api: "http://localhost:5000/api/products" to add product after login in as admin or seller.
56. To add a new product add these in req.body: {
    "name": "Iron" ,
    "description": "An Iron made with metal",
    "price":"50",
    "category":"Accessories",
    "stock":"3",
    "images":"https://tse4.mm.bing.net/th?id=OIP.RnrRwDlaPer9OhWnJvWCNgHaGD&pid=Api&P=0&h=220"
}

1.   Add getAllProducts.ts and write code to simply see all products and this does not need login in. Add in routes without auth.
2.   Add getSingleProducts.ts and write code to simply see 1 specific product and this does not need login in. Add in routes without auth.
3.   Implement Delete Product and add in protected routes.
4.   Add product validator while adding a new product in DB.
5.   Add UPDATE PRODUCT TO EDIT ANY PRODUCT INFO.
6.   Update product schema with default error message.
7.   Implement product soft delete so that the product remains in DB afrer deletion just not showing.
8.   getFilteredProducts is properly working now Alhamdulillah. Query example: "http://localhost:5000/api/products/filteredProducts?search=Towel&category=Accessories&priceMin=10&priceMax=10000&page=1&limit=10".
9.   I kept both soft and hard delete in routes with differeny route names.
10.  Product part is also almost complete.
11.  Seller can see his/her own created products (not soft deleted). For that Route updated slightly.
12.  Update ban user so that it automatically soft-delete all products if the user is a seller.
13.  Order model created.
14.  Create order implemented. use "{{url}}/orders/placeOrder" api. In body nothing is needed.
15. Add cart.model.ts for implementing cart module.
16. For cart create same strucrure module as producst, users.
17. Implement Add To Cart and che in postman with :{
      "productId": "680fcba9c0bc04521abf55a2",
      "quantity": 1,
      "shippingAddress": "123 Main Street, New York, NY, USA"(address optional if you wanna custimize, else default address from db)
}
1.  Update craeteOrder model and ts file so that order is taken from cart and body is not needed but you can add shippingAddress is want.
2.  Now if User is logged in as admin, can see even soft deleted products. 
3.  If seller can see his products that are soft deleted.
4.  Also seller can hard delete the soft deleted products and restore soft deleted products now.
5.  View cart added to see buyer's cart items.
6.  Admin can view all the orders and buyer can see all his orders with total price and dictinct price for all individual products too.
7.  Now admin/seller can update product shipment status.
8.  Buyer can now cancel an order if it is not shipped.
9.  For buyers, view all orders updated now cancelled orders ammount will not be calculated in total ammount.
10.  Install axios using 12 point above.
11.  For payment, install stripe using point 13 above.
12.  For using paypal add point 14 above in terminal and run.
13.  So Paypal api: POST: "{{url}}/payment/paypal", BODY: {
  "amount": "50.00",
  "currency": "USD"
}
1.   For stripe, add a new POST request with api: " https://api.stripe.com/v1/payment_methods" choose "Basic Auth" and "x-www-form-urlencoded" and add: "type: card", "card[token] : tok_visa" and then you should get something like: "pm_1RKPhARIm30GS1Gn6ubuA87d"
2.   Use the _id (pm_...) , add new PI: POST: "{{url}}/payment/stripe" BODY: {
  "amount": 1000,
  "currency": "usd",
  "paymentMethodId": "pm_1RKPc8RIm30GS1GnfstVTege" // Paste the actual ID here
}

1.   Payment is implemented just till this point. Tested too and working in postman.
2.   For error handling new file added in utils, 
3.   Payment service added for stripe and paypal so that from cart buyer can pay to added in order list if payment method is not COD.,
4.    Create order body example added in module orders, "order_body.md" file.
5.    CreateOrder, orderMOdel, paymentService updated to enable payment of ordering full cart at same time and also order specific product ordering with cod or ther type payment. They are all working now.
6.    Let us implement wishlist module.
7.    Create model for wishlist.
8.    Add to wish list imeplemented and route added to app.ts.
9.    The api to ad in wishlist: POST "http://localhost:5000/api/wishlist/add" , BODY: {
      "productId": "680fca599e0429f6ee517386"
}
10.   Get Wishlist and remove a product from wishlist added. pis are: GET: {{url}}/wishlist and DELETE: {{url}}/wishlist/remove/:productId; Nothing in body.
2.   Refund implemented. First, refund model created and refund module created where controllers and routes are addded. Order model is also updated to implement this. The apis are: PPST "{{url}}/refunds/request/6818d05d2e90a603bcfef01b"; GET:"{{url}}/refunds/"(for admin and seller); GET:"{{url}}/refunds/me" for buyer; GET:"{{url}}/refunds/6819b4faa71f2f7b94992f47" for admin and seller to ge specifinc refund request; PATCH:"{{url}}/refunds/6819cd156c69c9a8cfa5972e" for admin/seller to update the refund when approped or rejected.
3.   Now we are moving toward coupon feature.
4.   Create coupon model.
5.   Create coupon implemented, in postman, api: POST:"{{url}}/coupons/", body: {
    "code":"APPLE",
    "type":"percentage",
    "value":50,
    "usageCount":100
}
use variables from model to add in req.body.

1.   Use , GET:"{{url}}/coupons/"; to see all coupons.
2.   Use , GET:"{{url}}/coupons/APPLE"; to see perticular coupons.
3.   Use , PATCH :"{{url}}/coupons/APPLE"; body same as create coupon (with updated value) to update a coupon info.
4.   Use, DELETE : "{{url}}/coupons/apple"/ "{{url}}/coupons/APPLE" (not case sensetive, it is habdled by code) to delete APPLE(coupon code) coupon.
5.   To apply coupon in ordering add -> "couponCode":"BANANA" in body.
6.   Install moment by 15 point above to implement revenue calculation.
7.   Now let's move to revenue implementetion. for that in modules create admin module.
8.   First, update createOrders so that no buyers can order without adding products in cart.
9.   Add getRevenue.ts to let admin see tital revenue. Add route and add route in app.ts
10.  getRevenue.ts is working. api: GET: "{{url}}/admin/revenue"
11.  Discount added, now seller, admin can add discount.
12.  Revenue is also implemented.
13.  Install point 16 for API Rate Limiting and Security Enhancements.
14.  Install Swagger UI using 17,18 point above.
15.  You can now go "http://localhost:5000/api-docs/" and see api route UI.
16.  Now All routes need to be updated for for request body and parameter validation, ALhamdulillah.
17.  SWagger UI added for User Registration, see it in the link given in 134 point.
18.  Till now for all route swagger UI added.