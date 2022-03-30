import { Request, Response } from "express";
import supabase from "@/component/supabase";
import { RoomInvite } from "@/types/room-invite";
import bcrypt from "bcrypt";
import crypto from "crypto-js";

export default async function (req: Request, res: Response) {
  try {
    const { data } = await supabase
      .from("room_member_invite")
      .select()
      .eq("invite_id", req.body.invite_id)
      .single();
    const invite = data as RoomInvite;
    const verify = await bcrypt.compare(
      req.body.secret,
      invite.invite_secret_hash
    );
    if (verify) {
      const decryptSecret = crypto.AES.decrypt(
        invite.room_secret_encrypt,
        req.body.secret
      );
      const addMember = await supabase.from("room_member").insert({
        device_name: req.body.device_name,
        room_id: invite.room_id,
        member_id: req.headers["x-uid"],
      });
      if (addMember.error) {
        throw Error(addMember.error.message);
      }
      await supabase.from("room_member_invite").delete().eq("id", invite.id);
      res.status(201).json({
        room_id: invite.room_id,
        secret: decryptSecret.toString(crypto.enc.Utf8),
      });
      return;
    }
    res.status(401).json({
      message: "Wrong invite secret",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Some thing went wrong",
    });
  }
}
