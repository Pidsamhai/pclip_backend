import njwt from "njwt";
import { Request } from "express";

export default (role: String, req: Request): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]!;
    const jwt = njwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    if (jwt?.body.toJSON().role === role && jwt?.isExpired() === false) {
      return Promise.resolve();
    }
    throw Error("UnAuthorized");
  } catch (error) {
    console.log(error);
    return Promise.reject({ status: 401, message: "Unauthorized" });
  }
};
