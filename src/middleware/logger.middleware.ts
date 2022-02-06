import { Request, Response, NextFunction } from "express";

export default function (req: Request, _res: Response, next: NextFunction) {
  console.info("\x1b[32m", "####################################");
  console.info("\x1b[36m", `Request: ${req.path}`);
  console.info("\x1b[36m", `Method: ${req.method}`);
  console.info("\x1b[36m", "Headers: ");
  console.info("\x1b[36m", JSON.stringify(req.headers, null, 2));
  console.info("\x1b[36m", "Params: ");
  console.info("\x1b[36m", JSON.stringify(req.params, null, 2));
  console.info("\x1b[36m", `Body: ${req.body || ""}`);
  console.info("\x1b[32m", "####################################");
  next();
}
