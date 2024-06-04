import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import {
  Android,
  Microsoft,
  IOS,
  MacOS,
  Linux,
} from "@/components/shared/icons";
import GitHubPkg from "@/components/home/github-pkg";
import { platforms } from "@/constants";
import { getReleases } from "@/request";
import { useTranslation } from "@/i18n/client";
import type { LngProps } from "@/types/i18next-lng";
import type { Asset, Release } from "@/types/github";
import type { ExtType, SystemOS } from "@/types/common";

export default function GithubRelease({ lng }: LngProps) {
  const { t } = useTranslation(lng, "common");
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

  const { ios, android, macos, windows, linux } = useMemo(() => {
    const packages: Record<SystemOS, Asset[]> = {
      ios: [],
      android: [],
      macos: [],
      windows: [],
      linux: [],
    };
    Object.keys(platforms).forEach((platform: string) => {
      const matcher = (name: string) =>
        platforms[platform as SystemOS].some((ext: ExtType) => {
          // 如果是字符串, 直接判断文件后缀
          if (typeof ext === "string") {
            return name.endsWith(ext);
          } else {
            // 如果不是字符串类型, 则根据include的值来判断
            // 1. 如果为true, 判断文件后缀和系统类型
            // 2. 如果为false, 直接判断文件后缀
            const include = ext?.include;
            const extName = ext?.name;
            return include
              ? name.endsWith(extName) && name.includes(platform)
              : name.endsWith(extName);
          }
        });
      packages[platform as SystemOS] =
        assets.filter(({ name }) => name && matcher(name)) || [];
    });
    return packages;
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
      <div className="mt-10 grid w-full max-w-screen-xl animate-fade-up xl:px-0">
        <div className="flex items-center justify-center">
          <div className="grid w-full grid-cols-1 gap-5 px-10 sm:grid-cols-2 sm:px-10 md:grid-cols-4">
            <GitHubPkg
              lng={lng}
              disabled={disabled || !android.length}
              assets={android}
              wrapperClassName="border border-gray-300 hover:border-gray-800 shadow-md"
            >
              <Android className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">Android</span>
              </p>
            </GitHubPkg>
            <GitHubPkg
              lng={lng}
              disabled={disabled || !ios.length}
              assets={ios}
              wrapperClassName="border border-gray-300 hover:border-gray-800 shadow-md"
            >
              <IOS className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">iOS</span>
              </p>
            </GitHubPkg>
            <GitHubPkg
              lng={lng}
              disabled={disabled || !macos.length}
              assets={macos}
              wrapperClassName="border border-gray-300 hover:border-gray-800 shadow-md"
            >
              <MacOS className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">macOS</span>
              </p>
            </GitHubPkg>
            <GitHubPkg
              lng={lng}
              disabled={disabled || !windows.length}
              assets={windows}
              wrapperClassName="border border-gray-300 hover:border-gray-800 shadow-md"
            >
              <Microsoft className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">Windows</span>
              </p>
            </GitHubPkg>
            <GitHubPkg
              lng={lng}
              disabled={disabled || !linux.length}
              assets={linux}
              wrapperClassName="border border-gray-300 hover:border-gray-800 shadow-md"
            >
              <Linux className="h-7 w-7" />
              <p>
                <span className="sm:inline-block">Linux</span>
              </p>
            </GitHubPkg>
          </div>
        </div>
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
            href={`/${lng}/releases`}
            className="ml-2 text-sm text-gray-500 hover:underline dark:text-gray-400"
          >
            {t("more-versions")}
          </Link>
        </Balancer>
      </p>
    </>
  );
}
