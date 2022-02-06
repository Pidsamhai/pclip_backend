import express from "express";
import notFoundController from "@/controller/notfound.controller";
import rootRoute from "@/router/root.router";
import loggerMiddleware from "@/middleware/logger.middleware";
import cors from "cors";
import rateLimit from "express-rate-limit";

const server = express();

const port = process.env.PORT || 5000;

server.use(
  cors({
    origin: `http://localhost:${port}`,
    credentials: true,
  })
);
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later." },
  })
);
server.use(loggerMiddleware);
server.use(rootRoute);
server.use(notFoundController);

server.listen(port, () => {
  console.log("\x1b[36m", `$ App listen on http://localhost:${port}`);
});
