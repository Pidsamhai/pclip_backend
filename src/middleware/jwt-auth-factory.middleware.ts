import njwt from "njwt";
import { Request, Response, NextFunction } from "express";

export default (role: String) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]!;
      const jwt = njwt.verify(token, process.env.SUPABASE_JWT_SECRET);
      if (jwt?.body.toJSON().role === role && jwt?.isExpired() === false) {
        next();
        return;
      }
      throw Error("UnAuthorized");
    } catch (error) {
      console.log(error);
      res.status(401).send({ message: "UnAuthorized" });
    }
  };
