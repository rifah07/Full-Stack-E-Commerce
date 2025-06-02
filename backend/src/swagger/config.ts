import { Options } from "swagger-jsdoc";
import dotenv from "dotenv";

export const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ShopSphere: A-Complete-World-for-Shopping",
      version: "1.0.0",
      description:
        "API documentation for ShopSphere which is a multi-vendor e-commerce platform",
      /*contact: {
        //name: "ShopSphere API Support",
        //email: "support@shopsphere.com",
      },*/
      /*
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      */
    },
    servers: [
      {
        url: "https://shopsphere-a-complete-world-for-shopping.onrender.com/api",
        description: "Production server",
      },
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in format: Bearer <token>",
        },
      },
      schemas: {
        ...require("./schemas").default,
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Users",
        description:
          "User management endpoints including registration, authentication, and profile management",
      },
      {
        name: "Products",
        description:
          "Product management endpoints for creating, updating, and retrieving products",
      },
      {
        name: "Cart",
        description:
          "Shopping cart management endpoints for adding, updating, and removing items",
      },
      {
        name: "Wishlist",
        description:
          "Wishlist management endpoints for saving favorite products",
      },
      {
        name: "Orders",
        description:
          "Order management endpoints for creating and tracking orders",
      },
      {
        name: "Coupons",
        description:
          "Coupon management endpoints for discount codes and promotions",
      },
      {
        name: "Payments",
        description: "Payment processing endpoints for handling transactions",
      },
      {
        name: "Refunds",
        description:
          "Refund management endpoints for processing returns and refunds",
      },
      {
        name: "Reviews",
        description:
          "Review management endpoints for product ratings and feedback",
      },
      {
        name: "Revenue",
        description:
          "Revenue analytics endpoints for business intelligence and reporting",
      },
    ],
  },
  apis: [
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.docs.ts",
    "./src/models/*.model.ts",
  ],
};