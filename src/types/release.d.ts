export interface Asset {
  name: string;
  content_type: string;
  size: number;
  browser_download_url: string;
}

export interface Release {
  url: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Array<Asset>;
  body: string;
}
