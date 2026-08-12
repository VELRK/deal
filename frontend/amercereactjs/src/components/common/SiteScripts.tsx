import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useApi";
import { setLiveSiteName } from "@/lib/siteBrand";

const INJECTED_ATTR = "data-sk-dynamic-script";

function injectScripts(html: string, target: "head" | "body") {
  if (!html?.trim()) return;
  const container = document.createElement("div");
  container.innerHTML = html;
  const nodes = Array.from(container.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    // Never let admin head HTML overwrite the React-managed tab title
    if (el.tagName === "TITLE") return;

    if (el.tagName === "SCRIPT") {
      const script = document.createElement("script");
      script.setAttribute(INJECTED_ATTR, "1");
      Array.from(el.attributes).forEach((a) => script.setAttribute(a.name, a.value));
      if (el.textContent) script.textContent = el.textContent;
      (target === "head" ? document.head : document.body).appendChild(script);
    } else {
      el.setAttribute(INJECTED_ATTR, "1");
      (target === "head" ? document.head : document.body).appendChild(el.cloneNode(true));
    }
  });
}

/** Injects global head/footer scripts from admin SEO settings. */
export default function SiteScripts() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    document.querySelectorAll(`[${INJECTED_ATTR}]`).forEach((n) => n.remove());

    if (!settings) return;

    setLiveSiteName(settings.site_name);

    injectScripts(settings.head_scripts ?? "", "head");
    injectScripts(settings.footer_scripts ?? "", "body");

    const gaId = settings.google_analytics?.trim();
    if (gaId && !document.querySelector(`script[data-ga-id="${gaId}"]`)) {
      const gtag = document.createElement("script");
      gtag.async = true;
      gtag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      gtag.setAttribute(INJECTED_ATTR, "1");
      document.head.appendChild(gtag);
      const inline = document.createElement("script");
      inline.setAttribute(INJECTED_ATTR, "1");
      inline.setAttribute("data-ga-id", gaId);
      inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(inline);
    }
  }, [settings]);

  return null;
}
