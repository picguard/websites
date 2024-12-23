import "./globals.css";
import React from "react";
import cx from "classnames";
import { dir } from "i18next";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { GoogleAnalytics } from "@next/third-parties/google";
import { BiArrowToTop } from "react-icons/bi";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "muse-ui";
import CookieYes from "@/components/shared/cookie-yes";
import ScrollToTop from "@/components/layout/scroll-to-top";
import { languages } from "@/i18n/settings";
import Footer from "@/components/layout/footer";
import { domain } from "@/constants";
import { sfPro, inter } from "./fonts";
import Particles from "./particles";
import ThemeProvider from "./theme-provider";

// 是否显示背景特效
const NEXT_PUBLIC_SHOW_PARTICLES = process.env.NEXT_PUBLIC_SHOW_PARTICLES;
// 是否全站置灰
const NEXT_PUBLIC_WEBSITE_GLOBAL_GRAY =
  process.env.NEXT_PUBLIC_WEBSITE_GLOBAL_GRAY;
// Google tag (gtag.js)
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ID;

const Header = dynamic(() => import("@/components/layout/header"), {
  ssr: false,
});

export async function generateMetadata({
  params,
}: {
  params: { lng: string };
}): Promise<Metadata | undefined> {
  return {
    title: "PicGuard",
    description:
      "PicGuard - This app can add watermarks to pictures to prevent them from being used maliciously.",
    metadataBase: new URL(domain),
    icons: {
      icon: "/logo.png",
    },
  };
}

export async function generateStaticParams() {
  return languages.map((lng: string) => ({ lng }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <html
      lang={params.lng}
      dir={dir(params.lng)}
      className={NEXT_PUBLIC_WEBSITE_GLOBAL_GRAY ? "grayscale" : ""}
      suppressHydrationWarning
    >
      <body
        className={cx(
          sfPro.variable,
          inter.variable,
          "flex min-h-screen flex-col",
        )}
      >
        <NextTopLoader height={1} />
        <ThemeProvider>
          {NEXT_PUBLIC_SHOW_PARTICLES && <Particles />}
          <Header lng={params.lng} />
          <main
            id="main"
            className="flex w-full flex-1 flex-col items-center justify-center pt-32"
          >
            {children}
          </main>
          <Footer lng={params.lng} />
          <Toaster />
        </ThemeProvider>
        <ScrollToTop
          smooth
          component={
            <BiArrowToTop className="mx-auto my-0 h-5 w-5 text-gray-700" />
          }
        />
      </body>
      <CookieYes lng={params.lng} />
      {GA_TRACKING_ID && <GoogleAnalytics gaId={GA_TRACKING_ID} />}
    </html>
  );
}
