import njwt from "njwt";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const annonKey = req.headers.authorization?.split(" ")[1]!;
    const jwt = njwt.verify(annonKey, process.env.SUPABASE_JWT_SECRET);
    if (jwt?.body.toJSON().crole === "anon") {
      next();
      return;
    }
    throw Error("UnAuthorized");
  } catch (error) {
    res.status(401).send({ message: "UnAuthorized" });
  }
}
