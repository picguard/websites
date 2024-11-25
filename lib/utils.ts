import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";
import { systemExtensions } from "@/constants";
import type { ClassValue } from "clsx";
import type { ExtType, SystemOS } from "@/types/common";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * exclude匹配逻辑
 *
 * @param name 文件名
 * @param exclude 排除字符串或字符串数组
 * @returns
 */
export const excludeMatcher = (name: string, exclude: string | string[]) => {
  if (typeof exclude === "string") {
    return name.includes(exclude);
  } else {
    return exclude.findLastIndex((item) => name.includes(item)) !== -1;
  }
};

/**
 * 根据宿主系统进行分组
 *
 * @param name 文件名
 * @param platform 宿主系统
 * @returns
 */
export const matcher = (name: string, platform: SystemOS) =>
  systemExtensions[platform].some((ext: ExtType) => {
    // 如果是字符串, 直接判断文件后缀
    if (typeof ext === "string") {
      return name.endsWith(ext);
    } else {
      // 如果不是字符串类型, 则根据include的值来判断
      // 1. 如果为true, 判断文件后缀和系统类型
      // 2. 如果为false, 直接判断文件后缀
      const include = ext?.include;
      const exclude = ext?.exclude;
      const extName = ext?.name;

      // 如果不为空, 则排出包含此内容的文件
      if (exclude) {
        return include
          ? name.endsWith(extName) &&
              name.includes(platform) &&
              !excludeMatcher(name, exclude)
          : name.endsWith(extName) && !excludeMatcher(name, exclude);
      }

      return include
        ? name.endsWith(extName) && name.includes(platform)
        : name.endsWith(extName);
    }
  });
