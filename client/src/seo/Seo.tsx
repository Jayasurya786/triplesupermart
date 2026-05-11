import { useEffect } from "react";
import { defaultDescription, defaultTitle, siteUrl } from "@/seo/defaults";

interface SeoProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export function Seo({ title, description, canonical, image, schema }: SeoProps) {
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const pageDescription = description ?? defaultDescription;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  useEffect(() => {
    const upsertMeta = (attr: "name" | "property", key: string, content?: string) => {
      const selector = `meta[${attr}="${key}"]`;
      const existing = document.head.querySelector(selector);
      if (!content) {
        existing?.remove();
        return;
      }
      const element = existing ?? document.createElement("meta");
      element.setAttribute(attr, key);
      element.setAttribute("content", content);
      if (!existing) document.head.appendChild(element);
    };

    const upsertLink = (rel: string, href: string) => {
      const selector = `link[rel="${rel}"]`;
      const existing = document.head.querySelector(selector);
      const element = existing ?? document.createElement("link");
      element.setAttribute("rel", rel);
      element.setAttribute("href", href);
      if (!existing) document.head.appendChild(element);
    };

    const upsertSchema = (payload?: SeoProps["schema"]) => {
      const id = "seo-schema";
      const existing = document.getElementById(id);
      if (!payload) {
        existing?.remove();
        return;
      }
      const element = (existing as HTMLScriptElement | null) ?? document.createElement("script");
      element.id = id;
      element.type = "application/ld+json";
      element.text = JSON.stringify(payload);
      if (!existing) document.head.appendChild(element);
    };

    document.title = pageTitle;

    // Keep head tags in sync with route changes for SPA SEO support.
    upsertMeta("name", "description", pageDescription);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", canonicalUrl);
    upsertSchema(schema);
  }, [pageTitle, pageDescription, canonicalUrl, image, schema]);

  return null;
}