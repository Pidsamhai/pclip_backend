import { Request, Response } from "express";
import pkg from "../../package.json";

export default function (req: Request, res: Response) {
  res.json({
    message: pkg.description,
    author: pkg.author,
    repository: pkg.repository,
    version: pkg.version,
  });
}
