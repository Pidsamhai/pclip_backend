import { Request, Response } from "express";
import supabase from "@/component/supabase";
import { v4 } from "uuid";

export default async function (_req: Request, res: Response): Promise<void> {
  const password = "1234567890";
  const email = `${v4()}@mock.com`;
  await supabase.auth.api.createUser({
    email,
    password,
    email_confirm: true,
  });
  res.status(201).json({ email: email, password: password });
}
