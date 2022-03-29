import expressJsDocSwagger, { Options } from "express-jsdoc-swagger";
import { Express } from "express";
import path from "path";

const options = <Options>{
  info: {
    version: "1.0.0",
    title: "Pclip Api Docs",
    description: `<strong>SECRET: </strong><span>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAcU</span> <br>
      <strong>ANON: </strong><span>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs</span>`,
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
