import axios from "axios";
import samver from "semver";
import { Release } from "../types/release";

export class UpdateService {
  async check(version: string): Promise<Release | null> {
    try {
      const result = await axios.get<Release>(
        "https://api.github.com/repos/Pidsamhai/pclip_desktop/releases/latest",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      if (samver.lt(version, result.data.tag_name)) {
        return result.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}
