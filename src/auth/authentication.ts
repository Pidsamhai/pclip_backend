/* eslint-disable prefer-promise-reject-errors */
import { Request } from "express";
import userAuthMiddleware from "../middleware/user-auth.middleware";
import jwtAuthFactoryMiddleware from "../middleware/jwt-auth-factory.middleware";
import { SSecurity } from "../types/security";

export function expressAuthentication(
  request: Request,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  switch (securityName) {
    case SSecurity.ANON:
      return jwtAuthFactoryMiddleware("anon", request);
    case SSecurity.SECRET:
      return jwtAuthFactoryMiddleware("service_role", request);
    case SSecurity.USER:
      return userAuthMiddleware(request);
    default:
      return Promise.reject({ status: 401, message: "Unauthorized" });
  }
}
