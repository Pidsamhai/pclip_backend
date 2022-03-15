import { DefaultResponse } from "../types/default-response";
import {
  Controller,
  Get,
  Route,
  Security,
  SuccessResponse,
  Response,
  Res,
  TsoaResponse,
  Tags,
  Request,
} from "tsoa";
import axios from "axios";
import { Request as ExpressRequest } from "express";

/**
 * Hello
 */
@Tags("Sample Github Api")
@Route("github")
export class GetSecretController extends Controller {
  private baseUrl = "https://api.github.com";

  @Response<DefaultResponse>(400, "error")
  @SuccessResponse(200, "success")
  @Get("/{user}/repos")
  public async getUserRepos(user: string): Promise<{}> {
    const result = await axios({
      method: "GET",
      url: `${this.baseUrl}/users/${user}/repos`,
    });
    return result.data;
  }

  /**
   * Get repositories using personal token
   * <br> <a href="https://api.github.com/user/repos">https://api.github.com/user/repos</a>
   */
  @Get("/repos")
  @Security("gh_token")
  public async getPrivateUserRepos(
    @Request() req: ExpressRequest,
    @Res() notFoundResponse: TsoaResponse<404, DefaultResponse>
  ): Promise<{}> {
    try {
      const result = await axios({
        headers: {
          authorization: req.headers.authorization!,
        },
        method: "GET",
        url: `${this.baseUrl}/user/repos`,
      });
      return result.data;
    } catch (error) {
      return notFoundResponse(404, { message: "Not found" });
    }
  }
}
