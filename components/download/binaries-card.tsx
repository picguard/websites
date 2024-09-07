import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import type { LngProps } from "@/types/i18next-lng";
import type { Asset } from "@/types/github";

export default function BinariesCard({
  lng,
  assets,
}: LngProps & { assets: Asset[] }) {
  const { t } = useTranslation(lng, "download");

  return (
    <>
      <div className="mt-10 flex w-full max-w-screen-xl animate-fade-up flex-col rounded-xl border border-gray-200 p-4 hover:shadow-md dark:border-gray-700 dark:hover:shadow-gray-700">
        <span className="text-xl font-bold">{t("binaries")}</span>
        <span className="text-base text-gray-600 dark:text-white/80">
          {t("binaries-description")}
        </span>
        <div className="flex items-center">
          <ul>
            {assets.map((value: Asset) => {
              return (
                <li
                  key={value.id}
                  className="w-fit rounded-sm px-2 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-400"
                >
                  <Link
                    className="text-gray-600 dark:text-white/80"
                    href={value.browser_download_url || ""}
                  >
                    {value.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
