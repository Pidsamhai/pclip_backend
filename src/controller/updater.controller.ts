import { Updater } from "../types/updater";
import { Controller, Get, Response, Route, SuccessResponse, Path } from "tsoa";
import { UpdateService } from "../services/update.service";
import { Asset, Release } from "../types/release";

@Route("updater")
export class UpdaterController extends Controller {
  private updateService = new UpdateService();
  /**
   * @summary Get update for desktop app
   */

  private targetExt: Record<string, string> = {
    "darwin-x86_64": "app.tar.gz",
    window: "x64.msi.zip",
    linux: "AppImage.tar.gz",
  };

  @Get("/{target}/{version}")
  @SuccessResponse(200, "success")
  @Response(204, "no update")
  public async getUpdate(
    @Path("target") target: string,
    @Path("version") version: string
  ) {
    if (!Object.keys(this.targetExt).includes(target)) {
      this.setStatus(204);
      return;
    }
    const release: Release | null = await this.updateService.check(version);
    const asset: Asset | undefined = release?.assets.find((e) =>
      e.name.endsWith(this.targetExt[target])
    );
    if (asset == null) {
      this.setStatus(204);
      return;
    }

    return <Updater>{
      version: `v${release!.tag_name}`,
      notes: release!.body,
      pub_date: release!.published_at,
      url: asset.browser_download_url,
      signature: "",
    };
  }
}
