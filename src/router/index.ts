import express from "express";
import indexController from "@/controller/root.controller";
import creatAnonymousContoller from "@/controller/creat-anonymous.contoller";
import annonMiddleware from "@/middleware/annon.middleware";

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
 * @security JWT
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

export default route;
