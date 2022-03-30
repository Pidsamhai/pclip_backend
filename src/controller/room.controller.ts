import {
  Route,
  Request,
  SuccessResponse,
  Controller,
  Post,
  Body,
  Path,
  Security,
  Response,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import supabase from "../component/supabase";
import { RoomInvite } from "../types/room-invite";
import bcrypt from "bcrypt";
import crypto from "crypto-js";
import { SSecurity } from "../types/security";
import randomatic from "randomatic";
import { UnAuthorized } from "../types/exceptions";
import { JoinRoomBodyParams } from "src/types/params";

@Route("room")
export class RoomController extends Controller {
  /**
   * @summary Create room invite
   */
  @Security(SSecurity.USER)
  @SuccessResponse(201, "success")
  @Response<UnAuthorized>(401, "error")
  @Post("join")
  public async joinRoom(
    @Request() req: ExpressRequest,
    @Body() params: JoinRoomBodyParams
  ) {
    try {
      const { data } = await supabase
        .from("room_member_invite")
        .select()
        .eq("invite_id", params.invite_id)
        .single();
      const invite = data as RoomInvite;
      const verify = await bcrypt.compare(
        params.secret,
        invite.invite_secret_hash
      );
      if (verify) {
        const decryptSecret = crypto.AES.decrypt(
          invite.room_secret_encrypt,
          params.secret
        );
        const addMember = await supabase.from("room_member").insert({
          device_name: params.device_name,
          room_id: invite.room_id,
          member_id: req.headers["x-uid"],
        });
        if (addMember.error) {
          throw Error(addMember.error.message);
        }
        await supabase.from("room_member_invite").delete().eq("id", invite.id);
        return {
          room_id: invite.room_id,
          secret: decryptSecret.toString(crypto.enc.Utf8),
        };
      }
      this.setStatus(401);
      return Promise.reject("Wrong invite secret");
    } catch (error) {
      console.log(error);
      return Promise.reject("Some thing went wrong");
    }
  }

  /**
   * @summary Join room
   */
  @SuccessResponse(201, "success")
  @Security(SSecurity.USER)
  @Response<UnAuthorized>(401, "error")
  @Post("{room_id}/invite")
  public async inviteMember(
    @Path("room_id") roomId: string,
    @Body() params: { room_secret: string }
  ) {
    try {
      const roomSecret = params.room_secret;
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
      return {
        invite_id: inviteId,
        secret: inviteSecret,
      };
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
}
