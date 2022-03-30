import { Request, Response } from "express";
import supabase from "../component/supabase";
import randomatic from "randomatic";
import bcrypt from "bcrypt";
import crypto from "crypto-js";

export default async function (req: Request, res: Response): Promise<void> {
  try {
    const roomSecret = req.body.room_secret;
    const roomId = req.params.room_id;
    const inviteSecret = randomatic("A0", 6);
    const inviteId = randomatic("A0", 6);
    const inviteSecretHash = await bcrypt.hash(inviteSecret, 10);
    const roomSecretEncrypt = crypto.AES.encrypt(roomSecret, inviteSecret);
    const { error } = await supabase.from("room_member_invite").insert({
      room_secret_encrypt: roomSecretEncrypt.toString(),
      invite_secret_hash: inviteSecretHash,
      invite_id: inviteId,
      room_id: roomId,
    });
    if (error != null) {
      throw Error(error.message);
    }
    res.status(201).json({
      invite_id: inviteId,
      secret: inviteSecret,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error });
  }
}
