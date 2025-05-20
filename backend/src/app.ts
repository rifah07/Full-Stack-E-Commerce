import express from "express";
import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import morgan from "morgan";
import { morganStream } from "./utils/logger";
import errorHandler from "./handler/errorHandler";
import userRoutes from "./modules/users/users.routes";
import productRoutes from "./modules/products/products.routes";
import orderRoutes from "./modules/orders/orders.routes";
import cartRoutes from "./modules/cart/cart.routes";
import paymentRoutes from "./modules/payment/payment.route";
import wishlistRoutes from "./modules/wishlist/wishlist.routes";
import refundRoutes from "./modules/refund/refunds.routes";
import couponRoutes from "./modules/coupon/coupons.routes";
import adminRoutes from "./modules/admin/admin.routes";
import sellerRoutes from "./modules/seller/seller.routes";
import reviewRoutes from "./modules/review/review.routes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response, next: NextFunction, options: any) => {
    res.status(options.statusCode).send(options.message);
  },
});
app.use("/api/", limiter); // apply to all /api routes

// Security Headers
app.use(helmet());

app.use(express.json());
app.use(cookieParser());

// Morgan HTTP logging into Winston
app.use(morgan("combined", { stream: morganStream }));

// Swagger UI Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Multi-Vendor E-commerce API by Rifah",
      version: "1.0.0",
      description: "API documentation for the multi-vendor e-commerce platform",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Something went wrong",
            },
            statusCode: {
              type: "integer",
              example: 500,
            },
          },
        },
        Error400: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Bad Request",
            },
            statusCode: {
              type: "integer",
              example: 400,
            },
          },
        },
        Error401: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Unauthorized",
            },
            statusCode: {
              type: "integer",
              example: 401,
            },
          },
        },
        Error403: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Forbidden",
            },
            statusCode: {
              type: "integer",
              example: 403,
            },
          },
        },
        Error404: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Not Found",
            },
            statusCode: {
              type: "integer",
              example: 404,
            },
          },
        },
        Error409: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Conflict",
            },
            statusCode: {
              type: "integer",
              example: 409,
            },
          },
        },
        Error422: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Unprocessable Entity",
            },
            statusCode: {
              type: "integer",
              example: 422,
            },
          },
        },
        Error429: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Too Many Requests",
            },
            statusCode: {
              type: "integer",
              example: 429,
            },
          },
        },
        Error500: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Internal Server Error",
            },
            statusCode: {
              type: "integer",
              example: 500,
            },
          },
        },
        // ... other global schemas if any ...
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "Users", description: "User management endpoints" },
      { name: 'Products', description: 'Product management endpoints' },
      { name: 'Cart', description: 'Cart management endpoints' },
      // ... other tags
    ],
  },
  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.docs.ts",
    "./src/models/*.model.ts",
  ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//add routes here
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/review", reviewRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfully on port ${PORT}`);
});

export default app;