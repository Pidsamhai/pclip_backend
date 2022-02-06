import express from "express";
import notFoundController from "@/controller/notfound.controller";
import rootRoute from "@/router/root.router";
import loggerMiddleware from "@/middleware/logger.middleware";

const server = express();

const port = process.env.PORT || 5000;

server.use(loggerMiddleware);
server.use(rootRoute);
server.use(notFoundController);

server.listen(port, () => {
  console.log("\x1b[36m", `$ App listen on http://localhost:${port}`);
});
