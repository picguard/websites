import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { basePath, sitemapUrls } from "@/constants";
import { languages } from "@/i18n/settings";

const domain =
  process.env.NODE_ENV === "production"
    ? `https://www.kjxbyz.com${basePath}`
    : `http://localhost:3000${basePath}`;

export default function sitemap(): MetadataRoute.Sitemap {
  let sitemaps = allPosts
    .sort((a, b) => {
      return new Date(a.publishedAt) > new Date(b.publishedAt) ? -1 : 1;
    })
    .map((post) => ({
      url: `${domain}/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    }));

  sitemaps = sitemaps.concat(
    sitemapUrls.flatMap((url: string) => {
      return languages.map((lng: string) => ({
        url: `${domain}/${lng}/${url}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      }));
    }),
  );

  return sitemaps as MetadataRoute.Sitemap;
}
