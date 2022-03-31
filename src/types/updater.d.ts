export interface Platform {
  signature: string;
  url: string;
}

export interface Platforms {
  darwin: Platform;
  linux: Platform;
  win64: Platform;
}

export interface Updater {
  name: string;
  notes: string;
  pub_date: string;
  platforms: Platforms;
}
