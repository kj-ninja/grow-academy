import swaggerAutogen from "swagger-autogen";

const doc = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    description: "Description of my API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local server",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer", // corrected type
            description: "The User ID",
            example: 1, // example moved here
          },
          name: {
            type: "string",
            description: "The user name",
            example: "John Doe",
          },
          email: {
            type: "string",
            description: "The user email address",
            example: "john.doe@example.com",
          },
        },
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./src/index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
