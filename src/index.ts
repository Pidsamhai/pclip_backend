import express from "express";
import notFoundController from "@/controller/notfound.controller";
import loggerMiddleware from "@/middleware/logger.middleware";
import cors from "cors";
import rateLimit from "express-rate-limit";
import route from "./router";
import swaggerDoc from "./component/swagger-doc";

const server = express();

const port = process.env.PORT || 5000;

server.use(express.json());
swaggerDoc(server);
server.use(loggerMiddleware);
server.use(
  cors({
    // origin: `http://localhost:${port}`,
    // credentials: true,
  })
);
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later." },
  })
);

server.use("/api/v1", route);
server.use(notFoundController);

server.listen(port, () => {
  console.log("\x1b[36m", `$ 🚀 App listen on http://localhost:${port}`);
  console.log("\x1b[36m", `$ 📗 ApiDocs http://localhost:${port}/api-docs`);
});
