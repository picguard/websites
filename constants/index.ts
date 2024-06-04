import { ExtType, SystemOS } from "@/types/common";

export const cacheLngKey: string = "__picguard_lng__";
export const cacheThemeKey: string = "__picguard_theme__";
export const host =
  process.env.NODE_ENV === "production"
    ? "https://www.kjxbyz.com"
    : "http://localhost:3000";
export const basePath =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "/picguard" : "";
export const platforms: Record<SystemOS, ExtType[]> = {
  ios: [".ipa"],
  android: [".apk", ".aab"],
  macos: [
    ".dmg",
    ".pkg",
    { name: ".zip", include: true },
    { name: ".tar.gz", include: true },
  ],
  windows: [".exe", ".msix", { name: ".zip", include: true }],
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
