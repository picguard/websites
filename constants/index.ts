import { SystemExtensions, SystemOSKeys } from "@/types/common";

export const cacheLngKey: string = "__picguard_lng__";
export const cacheThemeKey: string = "__picguard_theme__";

export const basePath =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "" : "";
export const domain =
  process.env.NODE_ENV === "production"
    ? `https://www.picguard.app${basePath}`
    : `http://localhost:3000${basePath}`;

export const platforms: SystemOSKeys[] = [
  "ios",
  "android",
  "macos",
  "windows",
  "linux",
];
export const systemExtensions: SystemExtensions = {
  ios: [".ipa"],
  android: [".apk" /*, ".aab"*/],
  macos: [
    ".dmg",
    { name: ".pkg", exclude: "appstore" },
    { name: ".zip", include: true },
    { name: ".tar.gz", include: true },
  ],
  windows: [".exe", ".msi", /* ".msix",*/ { name: ".zip", include: true }],
  linux: [
    ".AppImage",
    ".deb",
    ".rpm",
    ".snap",
    ".flatpak",
    { name: ".zip", include: true },
    { name: ".tar.gz", include: true },
  ],
};

export const pageSize: number = 10;
export const sitemapUrls = ["download", "releases", "support"];
