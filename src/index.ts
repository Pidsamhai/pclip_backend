import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { RegisterRoutes } from "./tsoa/routes";
import loggerMiddleware from "./middleware/logger.middleware";
import notFound from "./component/notfound";
import path from "path";

const server = express();
const port = process.env.PORT || 5000;
server.use(express.json());
server.use(cors({}));

server.use(
  "/api-docs/swagger.json",
  express.static(path.resolve(__dirname, "tsoa", "swagger.json"))
);

server.use(
  "/api-docs",
  express.static(path.resolve(__dirname, "..", "swagger-ui"))
);

server.use(loggerMiddleware);

RegisterRoutes(server);

server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: "Too many requests, please try again later." },
  })
);
server.use(loggerMiddleware);
server.use(notFound);

server.listen(port, () => {
  console.log("\x1b[36m", `$ App listen on http://localhost:${port}`);
  console.log(
    "\x1b[36m",
    `$ Api docs listen on http://localhost:${port}/api-docs`
  );
});
