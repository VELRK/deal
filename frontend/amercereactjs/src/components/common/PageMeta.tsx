import { useEffect, useLayoutEffect, useRef } from "react";
import { useSiteSettings } from "@/hooks/useApi";
import { formatDocumentTitle, setLiveSiteName } from "@/lib/siteBrand";

export type FaqMetaItem = {
  question: string;
  answer: string;
};

export type PageMetaProps = {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  /** Visible FAQ entries — also emitted as FAQPage JSON-LD when non-empty */
  faqs?: FaqMetaItem[];
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

const FAQ_LD_ATTR = "data-page-meta-faq";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function upsertFaqJsonLd(faqs: FaqMetaItem[]) {
  const existing = document.head.querySelectorAll(`script[${FAQ_LD_ATTR}]`);
  existing.forEach((n) => n.remove());

  const valid = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (!valid.length) return;

  const payload = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: valid.map((f) => ({
      "@type": "Question",
      name: stripHtml(f.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripHtml(f.answer),
      },
    })),
  };

  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.setAttribute(FAQ_LD_ATTR, "1");
  el.text = JSON.stringify(payload);
  document.head.appendChild(el);
}

/**
 * Sets document.title from admin site_name and locks it against late SEO/script overwrites.
 */
export default function PageMeta({
  title,
  description = "",
  keywords = "",
  image = "",
  canonical = "",
  robots = "index,follow",
  ogType = "website",
  faqs = [],
}: PageMetaProps) {
  const { settings, loading: settingsLoading } = useSiteSettings();
  const siteName = settings?.site_name?.trim() || "";
  const desiredRef = useRef("");
  const faqsKey = JSON.stringify(faqs ?? []);

  useLayoutEffect(() => {
    if (siteName) setLiveSiteName(siteName);
  }, [siteName]);

  // Do not commit a final title until settings have resolved (avoids wrong brand flash)
  const brand = siteName || (!settingsLoading ? "2Deal" : "");
  const finalTitle = brand ? formatDocumentTitle(title, brand) : "";

  useLayoutEffect(() => {
    if (!finalTitle) return;

    desiredRef.current = finalTitle;
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
    try {
      upsertFaqJsonLd(JSON.parse(faqsKey) as FaqMetaItem[]);
    } catch {
      upsertFaqJsonLd([]);
    }
  }, [finalTitle, description, keywords, image, canonical, robots, ogType, faqsKey]);

  // Re-assert if SEO scripts / injected head HTML change <title> after load
  useEffect(() => {
    if (!finalTitle) return;

    const apply = () => {
      if (desiredRef.current && document.title !== desiredRef.current) {
        document.title = desiredRef.current;
      }
    };

    apply();
    const titleEl = document.querySelector("title");
    const obs = new MutationObserver(apply);
    if (titleEl) {
      obs.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
    // Also catch document.title assignments that replace the <title> node
    obs.observe(document.head, { childList: true, subtree: true });

    const interval = window.setInterval(apply, 500);
    const stop = window.setTimeout(() => window.clearInterval(interval), 8000);

    return () => {
      obs.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, [finalTitle]);

  return null;
}
