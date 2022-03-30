import { Request, Response } from "express";

export default function (_req: Request, res: Response) {
  res.json({
    message: "🚀🚀 Server Alive",
    time: Date.now(),
  });
}
