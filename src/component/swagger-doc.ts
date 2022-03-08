import expressJsDocSwagger from "express-jsdoc-swagger";
import { Express } from "express";
import path from "path";

const options = {
  info: {
    version: "1.0.0",
    title: "Pclip Backend Docs",
    license: {
      name: "MIT",
    },
  },
  security: {
    JWT: {
      type: "http",
      scheme: "bearer",
    },
    USER: {
      type: "http",
      scheme: "bearer",
    },
  },
  filesPattern: ["**/**/router/*.ts", "**/**/**/*.d.ts"],
  baseDir: path.join(__dirname, ".."),
};

export default (server: Express) => {
  expressJsDocSwagger(server)(options);
};
