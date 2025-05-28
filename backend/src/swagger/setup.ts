import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./config";

export const setupSwagger = (app: Application): void => {
  const swaggerDocs = swaggerJsdoc(swaggerOptions);

  const swaggerUiOptions = {
    customSiteTitle: "ShopSphere API Documentation",
    //customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
      showExtensions: true,
      tryItOutEnabled: true,
    },
  };

  // Setup
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs, swaggerUiOptions)
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
  });

  console.log(
    `Swagger documentation available at: http://localhost:${
      process.env.PORT || 5000
    }/api-docs`
  );
};