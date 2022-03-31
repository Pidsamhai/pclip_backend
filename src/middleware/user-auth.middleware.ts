import { Request } from "express";
import supabase from "../component/supabase";

export default async (req: Request): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]!;
    const { user, error } = await supabase.auth.api.getUser(token);
    console.log(user);
    console.error(error);
    if (user?.role === "authenticated") {
      req.headers["x-uid"] = user.id;
      return Promise.resolve(true);
    }
    throw Error("UnAuthorized");
  } catch (error) {
    console.log(error);
    return Promise.reject({ status: 401, message: "Unauthorized" });
  }
};
