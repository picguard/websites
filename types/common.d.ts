export type SystemOS = "ios" | "android" | "macos" | "windows" | "linux";

export interface Ext {
  name: string;
  include?: boolean;
  exclude?: string | string[];
}

export type ExtType = Ext | string;

export type SystemExtensions = Record<SystemOS, ExtType[]>;

export type SystemOSKeys = keyof SystemExtensions;
