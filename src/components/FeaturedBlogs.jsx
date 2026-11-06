// src/components/FeaturedBlogs.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Section from "./Section";
import Heading from "./Heading";

const FALLBACK_BLOGS = [
  {
    id: "fb-1",
    slug: "modern-web-development-trends-nepal-2026",
    title: "Modern Web Architecture & Full-Stack Solutions in 2026",
    category: "Web Development",
    author: "Globsoft Engineering",
    published_at: "2026-03-15",
    read_time: "5 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    snippet: "Why modern reactive frameworks, serverless APIs, and lightning-fast edge rendering are essential for businesses scaling their digital footprint in Nepal.",
  },
  {
    id: "fb-2",
    slug: "why-precision-hardware-matters-for-developers-gamers",
    title: "Why High-Precision Mechanical Keyboards & Mouse Accelerate Productivity",
    category: "Tech Solutions",
    author: "Hardware Lab",
    published_at: "2026-03-10",
    read_time: "4 min read",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    snippet: "From low-friction micro-weave desk mats to hot-swappable mechanical switches: how ergonomic peripherals prevent fatigue during marathon coding and gaming sessions.",
  },
  {
    id: "fb-3",
    slug: "seo-growth-strategies-for-businesses-nepal",
    title: "Actionable SEO & Digital Presence Strategies that Actually Convert",
    category: "SEO & Growth",
    author: "Growth Team",
    published_at: "2026-02-28",
    read_time: "6 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    snippet: "Step-by-step tactics to optimize local SEO, structure high-converting landing pages, and turn organic Google search queries into paying customers.",
  },
];

function formatDate(isoStr) {
  if (!isoStr) return "Recent";
  try {
    return new Date(isoStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recent";
  }
}

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState(FALLBACK_BLOGS);

  const adminPortalUrl = (
    import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
  ).replace(/\/+$/, "");

  useEffect(() => {
    let isMounted = true;
    fetch(`${adminPortalUrl}/api/blogs?fresh=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Map MongoDB schema to component structure
          const mapped = data.slice(0, 3).map((item, idx) => ({
            id: item._id || item.id || `blog-${idx}`,
            slug: item.slug || `article-${idx}`,
            title: item.title || "Globsoft Article",
            category: item.category || "Technology",
            author: item.author_name || item.author || "Globsoft Team",
            published_at: item.published_at || item.created_at || "",
            read_time: item.read_time || "5 min read",
            image: item.image || item.cover_image || FALLBACK_BLOGS[idx % 3].image,
            snippet: item.snippet || item.excerpt || (item.content ? item.content.replace(/<[^>]*>/g, "").slice(0, 140) + "..." : FALLBACK_BLOGS[idx % 3].snippet),
          }));
          setBlogs(mapped);
        }
      })
      .catch(() => {
        // Fallback already pre-loaded
      });

    return () => {
      isMounted = false;
    };
  }, [adminPortalUrl]);

  return (
    <Section className="overflow-hidden" id="blog">
      <div className="container relative z-2">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-color-1/10 border border-color-1/30 text-color-1 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-color-1 animate-pulse"></span>
            Insights &amp; Industry Guides
          </div>
          <Heading
            tag="Knowledge Hub"
            title="Latest Tech Stories &amp; Articles"
          />
          <p className="body-2 text-n-3 -mt-6">
            Explore battle-tested perspectives on web development, modern peripherals, scalable cloud architectures, and digital growth in Nepal.
          </p>
        </div>

        {/* 3 Featured Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {blogs.map((blog) => (
            <Link
              key={blog.id || blog.slug}
              to={`/blog/${blog.slug}`}
              className="group rounded-2xl bg-n-7 border border-n-6 overflow-hidden hover:border-color-1/50 transition-all duration-300 hover:shadow-xl hover:shadow-color-1/10 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-n-8">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-n-8/80 via-transparent to-transparent"></div>

                {/* Category Pill */}
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-n-8/90 border border-n-6 text-color-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                  {blog.category}
                </span>

                {/* Read time badge */}
                <span className="absolute bottom-3 right-3 text-[11px] text-n-3 bg-n-8/80 px-2 py-0.5 rounded backdrop-blur-sm">
                  {blog.read_time}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-n-4 mb-2.5">
                  <span>{formatDate(blog.published_at)}</span>
                  <span>•</span>
                  <span>By {blog.author}</span>
                </div>

                {/* Title */}
                <h4 className="text-base font-bold text-n-1 group-hover:text-color-1 transition-colors line-clamp-2 mb-2.5 leading-snug">
                  {blog.title}
                </h4>

                {/* Excerpt */}
                <p className="text-xs text-n-3 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {blog.snippet}
                </p>

                {/* Read Link */}
                <div className="pt-3 border-t border-n-6/60 flex items-center justify-between text-xs font-semibold text-color-1 mt-auto">
                  <span className="group-hover:translate-x-0.5 transition-transform">Read Full Article</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA to Full Blog */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 py-3 px-8 rounded-xl bg-n-7 border border-n-6 hover:border-color-1 text-n-1 hover:text-color-1 font-semibold text-xs uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-color-1/10"
          >
            <span>View All Blog Posts &amp; Tech Guides</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default FeaturedBlogs;
