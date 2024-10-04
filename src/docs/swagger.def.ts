import swaggerJSDoc from "swagger-jsdoc";
import ct from "@/common/constants";

export const swaggerDefinition: swaggerJSDoc.OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: `${ct.appName} - Express API Documentation`,
    version: ct.appVersion,
    description: ct.appDescription,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  servers: [
    {
      url: `${ct.base_url}/api/v1`,
      description: "Api Version 1 - V1",
    },
    {
      url: `${ct.base_url}/api/v2`,
      description: "Api Version 1 - V2",
    },
  ],
};
