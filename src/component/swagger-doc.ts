import expressJsDocSwagger, { Options } from "express-jsdoc-swagger";
import { Express } from "express";
import path from "path";

const options = <Options>{
  info: {
    version: "1.0.0",
    title: "Pclip Api Docs",
    description: "",
    license: {
      name: "MIT",
    },
  },
  security: {
    ANON: {
      type: "http",
      scheme: "bearer",
    },
    SECRET: {
      type: "http",
      scheme: "bearer",
    },
    USER: {
      type: "http",
      scheme: "bearer",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local dev server",
    },
  ],
  swaggerUiOptions: {
    customSiteTitle: "Pclip Api Docs",
  },
  filesPattern: ["**/**/router/*.ts", "**/**/**/*.d.ts"],
  baseDir: path.join(__dirname, ".."),
};

export default (server: Express) => {
  expressJsDocSwagger(server)(options);
};
