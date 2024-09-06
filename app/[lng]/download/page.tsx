"use client";
import React, { useCallback } from "react";
import Balancer from "react-wrap-balancer";
import GithubRelease from "@/components/home/github-release";
import StoreLinks from "@/components/home/store-links";
import { useTranslation } from "@/i18n/client";

export default function Home({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { t } = useTranslation(params.lng, "common");

  const Section = useCallback(
    ({
      title,
      children,
      className,
    }: {
      title: string;
      children: React.ReactNode;
      className?: string;
    }) => {
      return (
        <div
          className={`mt-20 w-full max-w-screen-xl animate-fade-up px-5 xl:px-0 ${className || ""}`}
        >
          <div className="flex flex-row flex-nowrap items-center justify-center text-center text-3xl before:mr-5 before:h-[1px] before:max-w-xs before:flex-1 before:border-b-[1px] before:border-dashed before:border-b-gray-300 before:content-[''] after:ml-5 after:h-[1px] after:max-w-xs after:flex-1 after:border-b-[1px] after:border-dashed after:border-b-gray-300 after:content-[''] dark:before:border-b-gray-600 dark:after:border-b-gray-600">
            {title}
          </div>
          {children}
        </div>
      );
    },
    [],
  );

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
      <Section className="mt-32" title={t("beta")}>
        <GithubRelease lng={params.lng} />
      </Section>
      <Section className="mb-20 mt-32" title={t("store")}>
        <StoreLinks lng={params.lng} />
      </Section>
    </>
  );
}
