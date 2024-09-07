"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { ToggleGroup, ToggleGroupItem } from "muse-ui";
import BinariesCard from "@/components/download/binaries-card";
import PkgCard from "@/components/download/pkg-card";
import StoreCard from "@/components/download/store-card";
import { platforms, systemExtensions } from "@/constants";
import { getReleases } from "@/request";
import { useTranslation } from "@/i18n/client";
import type { ExtType, SystemOS } from "@/types/common";
import type { Asset, Release } from "@/types/github";

export default function Home({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "common");

  const [platform, setPlatform] = useState<SystemOS>("android");
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Release>({});
  const [error, setError] = useState<any>(null);

  const assets = useMemo(() => {
    if (data.assets && data.assets.length) {
      return data.assets;
    }

    return [];
  }, [data.assets]);

  const tag_name = useMemo(() => {
    return data.tag_name;
  }, [data.tag_name]);

  /**
   * exclude匹配逻辑
   *
   * @param name 文件名
   * @param exclude 排除字符串或字符串数组
   * @returns
   */
  const excludeMatcher = (name: string, exclude: string | string[]) => {
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
  const matcher = (name: string, platform: SystemOS) =>
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

  const availableAssets = useMemo(() => {
    const packages: Record<SystemOS, Asset[]> = {
      ios: [],
      android: [],
      macos: [],
      windows: [],
      linux: [],
    };
    platforms.forEach((platform: SystemOS) => {
      packages[platform] =
        assets.filter(({ name }) => name && matcher(name, platform)) || [];
    });
    return packages;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets]);

  const loadData = () => {
    setLoading(true);
    getReleases(1, 1)
      .then((res) => {
        setLoading(false);
        if (res?.code === 0) {
          setData(res?.data?.[0] || {});
        } else {
          setError(res?.msg);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setError(error.message || error.toString());
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const disabled = useMemo(() => {
    if (loading) return true;

    return !!error;
  }, [loading, error]);

  return (
    <>
      <div className="w-full max-w-xl px-5 xl:px-0">
        <h1
          className="font-display animate-fade-up bg-clip-text text-center text-3xl font-bold tracking-[-0.02em] text-black/80 opacity-0 drop-shadow-sm dark:text-white/80 md:text-7xl md:leading-[5rem]"
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
        >
          <Balancer>{t("download")}</Balancer>
        </h1>
      </div>
      <p
        className="mt-4 animate-fade-up text-center text-sm opacity-0"
        style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
      >
        <Balancer>
          {tag_name && (
            <>
              {t("latest")}:{" "}
              <Link
                className="text-[#3e8fc8]"
                href={`https://github.com/picguard/picguard/releases/tag/${tag_name}`}
                target="_blank"
              >
                {tag_name}
              </Link>
            </>
          )}
          <Link
            href={`/${params.lng}/releases`}
            className="ml-2 text-sm text-gray-500 hover:underline dark:text-gray-400"
          >
            {t("more-versions")}
          </Link>
        </Balancer>
      </p>
      <ToggleGroup
        variant="outline"
        type="single"
        className="mt-12 w-full flex-wrap gap-x-6 gap-y-4"
        value={platform}
        onValueChange={(value) => {
          if (value) setPlatform(value as SystemOS);
        }}
      >
        <ToggleGroupItem className="font-bold" size="lg" value="android">
          Android
        </ToggleGroupItem>
        <ToggleGroupItem className="font-bold" size="lg" value="ios">
          iOS
        </ToggleGroupItem>
        <ToggleGroupItem className="font-bold" size="lg" value="macos">
          macOS
        </ToggleGroupItem>
        <ToggleGroupItem className="font-bold" size="lg" value="windows">
          Windows
        </ToggleGroupItem>
        <ToggleGroupItem className="font-bold" size="lg" value="linux">
          Linux
        </ToggleGroupItem>
      </ToggleGroup>
      <div
        className={`mb-20 mt-16 w-full max-w-screen-xl animate-fade-up px-5 xl:px-0`}
      >
        <div className="mt-6 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StoreCard lng={params.lng} platform={platform} />
          <BinariesCard
            lng={params.lng}
            platform={platform}
            assets={availableAssets[platform]}
          />
          <PkgCard lng={params.lng} platform={platform} />
        </div>
      </div>
    </>
  );
}
