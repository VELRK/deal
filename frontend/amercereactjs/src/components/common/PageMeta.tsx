import { useLayoutEffect } from "react";
import { useSiteSettings } from "@/hooks/useApi";

export type PageMetaProps = {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
};

function upsertHeadMeta(
  attr: "name" | "property",
  key: string,
  content: string,
) {
  if (!content) return;
  const selector =
    attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Ensure the browser tab title ends with the live site name from admin settings. */
function withSiteBrand(title: string, siteName: string): string {
  const brand = (siteName || "2Deal").trim() || "2Deal";
  const cleaned = title
    .replace(/\s*\|\s*2Deal\s*-\s*Incense Sticks[^|]*/gi, "")
    .replace(/\s*\|\s*2Deal Online Store\s*$/gi, "")
    .replace(/\s*\|\s*2DEAL\s*$/gi, "")
    .replace(/\s*\|\s*2Deal\s*$/gi, "")
    .trim();
  const base = cleaned || brand;
  if (base.toLowerCase() === brand.toLowerCase()) return brand;
  if (new RegExp(`\\|\\s*${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "i").test(base)) {
    return base;
  }
  return `${base} | ${brand}`;
}

/**
 * Sets document.title and SEO / social tags dynamically per page.
 */
export default function PageMeta({
  title,
  description = "",
  keywords = "",
  image = "",
  canonical = "",
  robots = "index,follow",
  ogType = "website",
}: PageMetaProps) {
  const { settings } = useSiteSettings();
  const siteName = settings?.site_name?.trim() || "2Deal";
  const finalTitle = withSiteBrand(title, siteName);

  useLayoutEffect(() => {
    document.title = finalTitle;
    upsertHeadMeta("name", "description", description);
    if (keywords) upsertHeadMeta("name", "keywords", keywords);
    if (robots) upsertHeadMeta("name", "robots", robots);
    upsertHeadMeta("property", "og:title", finalTitle);
    upsertHeadMeta("property", "og:description", description);
    upsertHeadMeta("property", "og:type", ogType);
    if (image) upsertHeadMeta("property", "og:image", image);
    upsertHeadMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertHeadMeta("name", "twitter:title", finalTitle);
    upsertHeadMeta("name", "twitter:description", description);
    if (image) upsertHeadMeta("name", "twitter:image", image);
    if (canonical) upsertLink("canonical", canonical);
  }, [finalTitle, description, keywords, image, canonical, robots, ogType]);

  return null;
}
