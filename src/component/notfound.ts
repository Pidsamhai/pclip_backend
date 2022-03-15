import { Request, Response } from "express";

export default function (_req: Request, res: Response) {
  res.status(404).json({ message: "Not found" });
}
