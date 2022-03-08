export interface RoomInvite {
  id: string;
  room_secret_encrypt: string;
  invite_secret_hash: string;
  expired: any;
  room_id: string;
}
