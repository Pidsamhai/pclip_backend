/**
 * @typedef {object} RoomMate
 * @property {string} id.required - UUID
 * @property {string} deviceName - Name of device in room
 * @example request
 * {
 *   "message": "Failed to save song because you did not specify a title",
 *   "errCode": "EV121"
 * }
 */
export interface RoomMate {
  id: string;
  deviceName: string;
}
