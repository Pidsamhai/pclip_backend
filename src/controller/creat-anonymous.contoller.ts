import { Request, Response } from "express";
import supabase from "../component/supabase";
import { v4 } from "uuid";
import randomatic from "randomatic";
import dotenv from "dotenv";

dotenv.config();

export default async function (_req: Request, res: Response): Promise<void> {
  const password = randomatic(16);
  const email = `${v4()}@anon-users.pidsamhai.com`;
  await supabase.auth.api.createUser({
    email,
    password,
    email_confirm: true,
  });
  const { data: session } = await supabase.auth.api.signInWithEmail(
    email,
    password
  );
  res.status(201).json(session);
}
