/**
 * @typedef {object} Platform
 * @property {string} signature
 * @property {string} url
 */
export interface Platform {
  signature: string;
  url: string;
}

/**
 * @typedef {object} Platforms
 * @property {Platform} darwin
 * @property {Platform} linux
 * @property {Platform} win64
 */
export interface Platforms {
  darwin: Platform;
  linux: Platform;
  win64: Platform;
}

/**
 * @typedef {object} UpdaterResponse
 * @property {string} name
 * @property {string} notes
 * @property {string} pub_date
 * @property {Platforms} platforms
 */

export interface Updater {
  name: string;
  notes: string;
  pub_date: string;
  platforms: Platforms;
}
