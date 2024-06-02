export type SystemOS = "ios" | "android" | "macos" | "windows" | "linux";

export interface Ext {
  name: string;
  include?: boolean;
}

export type ExtType = Ext | string;
