/* eslint-disable prefer-promise-reject-errors */
import { Request } from "express";
export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  /**
   * Basic check access token
   */
  if (securityName === "gh_token") {
    if (
      request.headers.authorization &&
      request.headers.authorization?.split(" ")?.[1]?.startsWith("ghp_") ===
        true
    ) {
      return Promise.resolve(true);
    }
  }
  return Promise.reject({ status: 401, message: "Unauthorized" });
}
