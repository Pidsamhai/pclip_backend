import express from "express";
import indexController from "@/controller/root.controller";
import creatAnonymousContoller from "@/controller/creat-anonymous.contoller";
import annonMiddleware from "@/middleware/annon.middleware";
import createMockUserController from "@/controller/create-mock-user.controller";
import createRoomInviteController from "@/controller/create-room-invite.controller";
import secretMiddleware from "@/middleware/secret.middleware";

const route = express.Router();

/**
 * GET /
 * @summary This is the summary of the endpoint
 * @return {object} 200 - success response - application/json
 * @example response - 200 - example success response
 * {
 *   "id": "123",
 *   "deviceName": "Mac"
 * }
 */
route.all("/", indexController);

/**
 * POST /auth/anonymous
 * @summary Create an anonymous account
 * @security ANON
 * @return {object} 201 - success response - application/json
 * @return {object} 401 - error response - application/json
 * @example response - 201 - success response
 * {
 *  "access_token": "<token>",
 *  "token_type": "bearer",
 *  "expires_in": 3600,
 *  "refresh_token": "<refreshToken>",
 *  "user": {
 *    "id": "81c422a7-4ae2-4d6c-aa9f-100a618d7e2b",
 *    "aud": "authenticated",
 *    "role": "authenticated",
 *    "email": "<random_unique_id>@anon-users.pidsamhai.com",
 *    "email_confirmed_at": "2022-03-05T20:04:04.641947Z",
 *    "phone": "",
 *    "confirmed_at": "2022-03-05T20:04:04.641947Z",
 *    "last_sign_in_at": "2022-03-05T20:04:05.23002651Z",
 *    "app_metadata": {
 *      "provider": "email",
 *      "providers": [
 *        "email"
 *      ]
 *    },
 *    "user_metadata": {},
 *    "identities": [],
 *    "created_at": "2022-03-05T20:04:04.639664Z",
 *    "updated_at": "2022-03-05T20:04:05.231371Z"
 *  },
 *  "expires_at": 1646514245
 * }
 * @example response - 401 - error response
 * {
 *    "message": "UnAuthorized"
 * }
 */
route.post("/auth/anonymous", annonMiddleware, creatAnonymousContoller);

/**
 * POST /auth/mockuser
 * @summary Create mock user with verified email
 * @security SECRET
 * @return {object} 201 - success response - application/json
 * @return {object} 401 - error response - application/json
 * @example response - 201 - success response
 * {
 *  "email": "",
 *  "password": ""
 * }
 * @example response - 401 - error response
 * {
 *    "message": "UnAuthorized"
 * }
 */
route.post("/auth/mockuser", secretMiddleware, createMockUserController);

/**
 * POST /room/invite/{room_id}
 * @summary Create room invite
 * @param {string} room_id.path.required - room id
 * @param {RequestInvite} request.body.required - room secret - application/json
 * @return {object} 201 - success response - application/json
 * @return {object} 401 - error response - application/json
 * @example response - 201 - success response
 * {
 *  "invite_id": "UUID",
 *  "secret": "<invite secret>"
 * }
 * @example response - 401 - error response
 * {
 *    "message": "UnAuthorized"
 * }
 */
route.post("/room/invite/:room_id", createRoomInviteController);

export default route;
