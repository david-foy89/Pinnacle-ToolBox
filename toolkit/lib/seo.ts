import type { Metadata } from "next";
import { getToolBySlug, tools } from "./tools";
import type { Tool, ToolFAQ } from "./types";
import { SITE_NAME, SITE_URL } from "./utils";

export const SITE_DESCRIPTION =
  "60+ free online tools for text, images, code, math, PDFs, and productivity. Fast, private, and browser-based — no login or upload to servers required.";

export const SITE_TAGLINE = "Free Online Tools — Fast, Simple, Private";

export const DEFAULT_OG_IMAGE = "/logo.png";

/** Stable date for sitemap lastmod — update when publishing meaningful site changes. */
export const SITE_LAST_UPDATED = new Date("2026-06-25");

const HOME_KEYWORDS = [
  "free online tools",
  "browser tools",
  "online utilities",
  "no login tools",
  "privacy tools",
  "text tools",
  "image tools",
  "developer tools",
  "json formatter",
  "word counter",
  "qr code generator",
  "unit converter",
  "pdf tools",
  "productivity tools",
];

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

function toolKeywords(tool: Tool): string[] {
  const categoryShort = tool.category.replace(/ Tools$/, "").toLowerCase();
  return [
    tool.name.toLowerCase(),
    tool.slug.replace(/-/g, " "),
    `free ${tool.name.toLowerCase()}`,
    `${tool.name.toLowerCase()} online`,
    categoryShort,
    "free online tool",
    "no login",
    "browser tool",
    SITE_NAME.toLowerCase(),
  ];
}

function sharedOpenGraph(
  title: string,
  description: string,
  url: string
): Metadata["openGraph"] {
  return {
    title,
    description,
    url,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  };
}

function sharedTwitter(title: string, description: string): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title,
    description,
    images: [DEFAULT_OG_IMAGE],
  };
}

const INDEX_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export function generateHomeMetadata(): Metadata {
  const title = `${SITE_NAME} — ${SITE_TAGLINE}`;
  const description = SITE_DESCRIPTION;
  const url = SITE_URL;

  return {
    title: { absolute: title },
    description,
    keywords: HOME_KEYWORDS,
    alternates: { canonical: url },
    openGraph: sharedOpenGraph(title, description, url),
    twitter: sharedTwitter(title, description),
    robots: INDEX_ROBOTS,
  };
}

export function generateToolMetadata(slug: string): Metadata {
  const tool = getToolBySlug(slug);
  if (!tool) {
    const fullTitle = `Tool Not Found | ${SITE_NAME}`;
    return {
      title: { absolute: fullTitle },
      openGraph: { title: fullTitle },
      robots: { index: false, follow: true },
    };
  }

  const title = tool.metaTitle;
  const description = tool.metaDescription;
  const url = `${SITE_URL}/tools/${slug}`;

  return {
    title: { absolute: title },
    description,
    keywords: toolKeywords(tool),
    alternates: { canonical: url },
    openGraph: sharedOpenGraph(title, description, url),
    twitter: sharedTwitter(title, description),
    robots: INDEX_ROBOTS,
  };
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  keywords?: string[]
): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: sharedOpenGraph(fullTitle, description, url),
    twitter: sharedTwitter(fullTitle, description),
    robots: INDEX_ROBOTS,
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    inLanguage: "en-US",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(DEFAULT_OG_IMAGE),
    },
    description: SITE_DESCRIPTION,
    sameAs: [],
  };
}

export function generateHomeItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} — All Free Online Tools`,
    description: SITE_DESCRIPTION,
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: `${SITE_URL}/tools/${tool.slug}`,
    })),
  };
}

export function generateBreadcrumbJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.category,
        item: `${SITE_URL}/#${categorySlug(tool.category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: `${SITE_URL}/tools/${tool.slug}`,
      },
    ],
  };
}

export function generateFaqJsonLd(faqs: ToolFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateHowToJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.name}`,
    description: tool.description,
    step: tool.howToUse.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
    })),
  };
}

export function generateSoftwareApplicationJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/tools/${tool.slug}#app`,
    name: tool.name,
    description: tool.description,
    applicationCategory: "UtilitiesApplication",
    applicationSubCategory: tool.category,
    operatingSystem: "Web Browser",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    url: `${SITE_URL}/tools/${tool.slug}`,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    author: { "@id": `${SITE_URL}/#organization` },
    provider: { "@id": `${SITE_URL}/#organization` },
    isAccessibleForFree: true,
    featureList: [
      "Runs entirely in the browser",
      "No account or login required",
      "Private — data stays on your device",
      "Free to use",
    ],
  };
}

export function generateToolPageJsonLd(tool: Tool): string {
  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      generateSoftwareApplicationJsonLd(tool),
      generateBreadcrumbJsonLd(tool),
      generateFaqJsonLd(tool.faqs),
      generateHowToJsonLd(tool),
    ],
  });
}

export function generateHomePageJsonLd(): string {
  return serializeJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      generateWebSiteJsonLd(),
      generateOrganizationJsonLd(),
      generateHomeItemListJsonLd(),
    ],
  });
}
