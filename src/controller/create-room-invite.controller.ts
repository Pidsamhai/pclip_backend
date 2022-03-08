import { Request, Response } from "express";
import supabase from "@/component/supabase";
import randomatic from "randomatic";
import bcrypt from "bcrypt";
import crypto from "crypto-js";
import { RoomInvite } from "@/types/room-invite";

export default async function (req: Request, res: Response): Promise<void> {
  try {
    const roomSecret = req.body.room_secret;
    const roomId = req.params.room_id;
    const inviteSecret = randomatic(6);
    const inviteSecretHash = await bcrypt.hash(inviteSecret, 10);
    const roomSecretEncrypt = crypto.AES.encrypt(roomSecret, inviteSecret);
    const { data, error } = await supabase.from("room_member_invite").insert({
      room_secret_encrypt: roomSecretEncrypt.toString(),
      invite_secret_hash: inviteSecretHash,
      room_id: roomId,
    });
    if (error != null) {
      throw Error(error.message);
    }
    const roomInvite = data![0] as RoomInvite;
    res.status(201).json({
      invite_id: roomInvite.id,
      secret: inviteSecret,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error });
  }
}
