import { useLayoutEffect } from "react";
import { useSiteSettings } from "@/hooks/useApi";
import { formatDocumentTitle, setLiveSiteName } from "@/lib/siteBrand";

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

/**
 * Sets document.title and SEO / social tags dynamically per page.
 * Always ends with admin site_name once settings are loaded.
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
  const { settings, loading: settingsLoading } = useSiteSettings();
  const siteName = settings?.site_name?.trim() || "";

  useLayoutEffect(() => {
    if (siteName) setLiveSiteName(siteName);
  }, [siteName]);

  // Wait for settings so we don't flash a wrong brand, then lock the real title
  const brandReady = !settingsLoading;
  const finalTitle = brandReady
    ? formatDocumentTitle(title, siteName || "2Deal")
    : formatDocumentTitle(title, siteName || undefined);

  useLayoutEffect(() => {
    if (!brandReady && !siteName) {
      // Keep index.html / previous title until we know the real site name
      return;
    }
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
  }, [brandReady, siteName, finalTitle, description, keywords, image, canonical, robots, ogType]);

  return null;
}
