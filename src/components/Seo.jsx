import { useEffect } from "react";
import { brandName, brandMotto, brandVision } from "../constants";

const siteUrl = "https://globsoft.vercel.app";
const defaultTitle = `${brandName} | ${brandMotto}`;
const defaultDescription = `${brandVision} We build high-performance websites, mobile apps, and digital experiences for businesses in Nepal and around the world.`;

const pageMetadata = {
  home: {
    title: defaultTitle,
    description: defaultDescription,
    path: "/",
  },
  order: {
    title: `Start Your Project | ${brandName}`,
    description:
      `${brandVision} Tell ${brandName} about your website, mobile app, or digital product and get a practical plan built around your goals.`,
    path: "/order",
  },
};

const setMeta = (attribute, value, content) => {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const Seo = ({ page = "home" }) => {
  const metadata = pageMetadata[page] || pageMetadata.home;

  useEffect(() => {
    const canonicalUrl = `${siteUrl}${metadata.path}`;
    document.title = metadata.title;

    setMeta("name", "description", metadata.description);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
    setMeta("name", "twitter:url", canonicalUrl);

    const canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", canonicalUrl);
    }
  }, [metadata]);

  return null;
};

export default Seo;
