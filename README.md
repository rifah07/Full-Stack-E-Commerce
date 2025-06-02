# 🛍️ ShopSphere Backend – A Complete World for Shopping (API)

ShopSphere is a full-featured backend API for an advanced e-commerce platform, supporting features such as product management, cart, orders, reviews, payment, revenue tracking, and user roles. This backend is built using **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**, and includes robust middleware, security, and API documentation with **Swagger**.

## 🌐 Live API Docs

Access the live Swagger API documentation:

👉 [https://shopsphere-a-complete-world-for-shopping.onrender.com/api-docs](https://shopsphere-a-complete-world-for-shopping.onrender.com/api-docs)

---

## 🧰 Tech Stack

| Layer        | Technology         |
|--------------|--------------------|
| Runtime      | Node.js            |
| Language     | TypeScript         |
| Framework    | Express.js         |
| Database     | MongoDB            |
| Validation   | Zod                |
| Auth         | JWT, Cookies       |
| Logging      | Morgan + Winston   |
| Security     | Helmet, Rate Limiting, CORS |
| Documentation| Swagger (OpenAPI)  |

---

## 🚀 Features

### 🧑‍💻 Users
- Register, login, logout
- Role-based access (admin, seller, buyer)
- Profile management
- Password reset and change

### 🛍️ Products
- CRUD operations for products
- Filtering, searching, sorting
- Seller-specific product management

### ❤️ Wishlist
- Add/remove products from wishlist

### 🛒 Cart
- Add/remove/update cart items

### 📦 Orders
- Place, view, cancel orders
- Order status management
- Shipment status management 

### 💳 Payment
- Process payments (integrated via Stripe and paypal in full implementation)

### 🎟️ Coupons
- Apply coupons during checkout
- Admin, Seller manages own coupons

### 🔁 Refunds
- Request and manage refunds

### 🌟 Reviews
- Submit and view product reviews

### 📈 Revenue
- Revenue tracking for admin and seller dashboards

---

## 🗂️ Project Structure

backend/
├── src/
│   ├── config/
│   │   └── db.ts                   # MongoDB connection setup
│
│   ├── handler/
│   │   └── errorHandler.ts        # Global error handling middleware
│
│   ├── managers/
│   │   ├── emailManager.ts        # Email-related logic (Mailtrap)
│   │   └── jwtManager.ts          # JWT token generation & verification
│
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # Auth protection middleware
│   │   └── authorize.ts           # Role-based access control
│
│   ├── models/                    # Mongoose models (User, Product, Order, etc.)
│
│   ├── modules/                   # Feature-based modules (users, products, etc.)
│   │   ├── users/
│   │   │   ├── controllers/
            ├── users.routes.ts
            ├── users.docs.ts
│   │   │   └── ...
│   │   └── ...                    # Similar structure for other modules
│
│   ├── services/                  
│
│   ├── swagger/
│   │   └── ...                    # Swagger configuration and docs
│
│   ├── utils/
│   │   ├── AppError.ts            # Custom error class
│   │   ├── cartItem.ts            # Utility functions for cart management
│   │   ├── catchAsync.ts          # Wrapper to catch async errors
│   │   ├── errors.ts              # Centralized error messages
│   │   └── logger.ts              # Winston/Morgan logger setup
│
│   ├── validators/
│   │   ├── product.validator.ts   # Zod schema for product validation
│   │   └── user.validator.ts      # Zod schema for user validation
│
│   ├── app.ts                     # Main Express app configuration
│   └── server.ts                  # Entry point - starts the server
│
├── .env                           # Environment variables
├── .example.env                   # Sample environment file
├── .gitignore
├── nodemon.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── stepsOfProject.md              # Project development plan or docs
└── README.md                      # Project overview and usage

---

## 🧪 API Testing
Use Swagger for easy testing:
-📄 Swagger UI: [https://shopsphere-a-complete-world-for-shopping.onrender.com/api-docs](https://shopsphere-a-complete-world-for-shopping.onrender.com/api-docs/)


## ✨ Upcoming (Frontend - In Sha Allah)
The React frontend will be built in a separate repository and integrated with this backend via secure REST APIs.

## Acknowledgements
Developed by Rifah Sajida Deya
