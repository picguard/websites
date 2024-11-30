"use client";
import Script from "next/script";
import { LngProps } from "@/types/i18next-lng";

const NEXT_PUBLIC_COOKIE_BANNER_ID = process.env.NEXT_PUBLIC_COOKIE_BANNER_ID;

const CookieYes = (props: LngProps) => {
  if (!NEXT_PUBLIC_COOKIE_BANNER_ID) return null;

  return (
    <Script
      id="cookieyes"
      src={`https://cdn-cookieyes.com/client_data/${NEXT_PUBLIC_COOKIE_BANNER_ID}/script.js`}
    />
  );
};

export default CookieYes;
