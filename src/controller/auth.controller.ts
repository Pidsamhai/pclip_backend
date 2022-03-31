import {
  Controller,
  Post,
  Route,
  Request,
  SuccessResponse,
  Response,
  Security,
} from "tsoa";
import { Request as ExpressRequest } from "express";
import supabase from "../component/supabase";
import { v4 } from "uuid";
import randomatic from "randomatic";
import dotenv from "dotenv";
import { SSecurity } from "../types/security";
import { UnAuthorized } from "../types/exceptions";

dotenv.config();

@Route("auth")
export class AuthController extends Controller {
  /**
   * @summary Create an anonymous account
   */
  @Security(SSecurity.ANON)
  @SuccessResponse(201, "success")
  @Response<UnAuthorized>(401, "error")
  @Post("/anonymous")
  public async createAnonymousAccount(@Request() req: ExpressRequest) {
    const password = randomatic(16);
    const email = `${v4()}@anon-users.pidsamhai.com`;
    await supabase.auth.api.createUser({
      email,
      password,
      email_confirm: true,
    });
    const { data: session } = await supabase.auth.api.signInWithEmail(
      email,
      password
    );
    return session;
  }

  /**
   * @summary Create mock user with verified email
   */
  @Security(SSecurity.SECRET)
  @SuccessResponse(201, "success")
  @Response<UnAuthorized>(401, "error")
  @Post("/mockuser")
  public async createMockUser() {
    const password = "1234567890";
    const email = `${v4()}@mock.com`;
    await supabase.auth.api.createUser({
      email,
      password,
      email_confirm: true,
    });
    const { data } = await supabase.auth.api.signInWithEmail(email, password);
    return {
      email: email,
      password: password,
      token: data?.access_token,
    };
  }
}
