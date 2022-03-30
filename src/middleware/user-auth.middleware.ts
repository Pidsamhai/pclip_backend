import { Request, Response, NextFunction } from "express";
import supabase from "@/component/supabase";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1]!;
    const { user, error } = await supabase.auth.api.getUser(token);
    console.log(user);
    console.error(error);
    if (user?.role === "authenticated") {
      req.headers["x-uid"] = user.id;
      next();
      return;
    }
    throw Error("UnAuthorized");
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "UnAuthorized" });
  }
}
