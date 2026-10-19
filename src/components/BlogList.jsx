import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

const apiBase = (
  import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
).replace(/\/+$/, "");

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://globsoft.vercel.app";

const CATEGORIES = [
  "All",
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "Tech Solutions",
  "SEO & Growth",
  "Business Strategy",
  "Cloud & Hosting",
  "Tutorials & Guides",
  "Technology",
];

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(6);

  useEffect(() => {
    fetch(`${apiBase}/api/blogs?fresh=${Date.now()}`, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("failed");
        return r.json();
      })
      .then((data) => {
        setBlogs(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  // SEO — update document head
  useEffect(() => {
    const pageTitle = "Blog | Globsoft Tech";
    const desc =
      "Practical insights on websites, digital growth, SEO, and technology from Globsoft Tech — your trusted tech partner in Nepal.";
    const canonical = `${SITE_URL}/blog`;
    const ogImage = `${SITE_URL}/social-preview.jpg`;

    document.title = pageTitle;

    const setMeta = (attr, key, val) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    setMeta("name", "description", desc);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", "Globsoft Tech");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }, []);

  // Sort blogs latest first (strictly by published_at, then created_at, then id)
  const sortedBlogs = useMemo(() => {
    return [...blogs].sort((a, b) => {
      const timeA = new Date(a.published_at || a.created_at || 0).getTime();
      const timeB = new Date(b.published_at || b.created_at || 0).getTime();
      if (timeB !== timeA) return timeB - timeA;
      return String(b.id || "").localeCompare(String(a.id || ""));
    });
  }, [blogs]);

  // Filtered blogs by category and search (preserves latest-first order)
  const filteredBlogs = useMemo(() => {
    return sortedBlogs.filter((b) => {
      const matchesCat =
        activeCategory === "All" ||
        (b.category && b.category.toLowerCase() === activeCategory.toLowerCase());

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
        (b.author && b.author.toLowerCase().includes(q)) ||
        (b.tags && b.tags.toLowerCase().includes(q)) ||
        (b.category && b.category.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [sortedBlogs, activeCategory, searchQuery]);

  // Reset to page 1 on filter, search, or postsPerPage change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, postsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / postsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * postsPerPage;

  const paginatedBlogs = useMemo(() => {
    return filteredBlogs.slice(startIndex, startIndex + postsPerPage);
  }, [filteredBlogs, startIndex, postsPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    const el = document.getElementById("blogListSection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("...");
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safeCurrentPage]);

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <p className="blog-kicker">Globsoft Tech Insights</p>
        <h1>Ideas to help your business grow online.</h1>
        <p>
          Practical guides, technology insights, and digital growth strategies
          for ambitious businesses in Nepal and beyond.
        </p>

        {/* Search bar */}
        <div className="blog-search-wrapper">
          <div className="blog-search-box">
            <span className="blog-search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, topic, or keyword..."
              aria-label="Search articles"
              className="blog-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="blog-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (from FlaskBlog) */}
        <div className="blog-category-nav" role="tablist" aria-label="Article categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`blog-category-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="blog-list-section" id="blogListSection" aria-label="Blog posts">
        {status === "loading" && (
          <p className="blog-state">Loading articles...</p>
        )}
        {status === "error" && (
          <p className="blog-state">
            Articles are temporarily unavailable. Please try again soon.
          </p>
        )}
        {status === "ready" && blogs.length === 0 && (
          <p className="blog-state">No published articles yet. Check back soon!</p>
        )}

        {status === "ready" && blogs.length > 0 && filteredBlogs.length === 0 && (
          <div className="blog-no-match">
            <p>No articles found matching your filter.</p>
            <button
              type="button"
              className="blog-reset-btn"
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {status === "ready" && filteredBlogs.length > 0 && (
          <div className="blog-list-toolbar">
            <div className="blog-toolbar-left">
              <span className="blog-results-count">
                Showing <strong>{startIndex + 1}–{Math.min(startIndex + postsPerPage, filteredBlogs.length)}</strong> of <strong>{filteredBlogs.length}</strong> articles
              </span>
              <span className="blog-sort-indicator">
                <i className="ri-flashlight-line" style={{ marginRight: 4 }}></i> Latest first
              </span>
            </div>
            <div className="blog-toolbar-right">
              <span className="blog-per-page-label">Per page:</span>
              <div className="blog-per-page-options">
                {[3, 6, 9, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`blog-per-page-btn ${postsPerPage === num ? "active" : ""}`}
                    onClick={() => setPostsPerPage(num)}
                    aria-label={`Show ${num} articles per page`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="blog-grid">
          {paginatedBlogs.map((blog, index) => (
            <article className="blog-card" key={blog.id}>
              {index === 0 && safeCurrentPage === 1 && !searchQuery && activeCategory === "All" && (
                <span className="blog-latest-badge" title="Most recently published article">
                  <span className="blog-latest-dot"></span> Latest
                </span>
              )}
              {blog.image_url ? (
                <Link
                  to={`/blog/${blog.slug}`}
                  className="blog-card-img-link"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={`${apiBase}${blog.image_url}`}
                    alt={blog.title}
                    loading="lazy"
                    className="blog-card-img"
                  />
                  {blog.category && (
                    <span className="blog-card-category-badge">
                      {blog.category}
                    </span>
                  )}
                </Link>
              ) : (
                blog.category && (
                  <div className="blog-card-category-header">
                    <span className="blog-card-category-badge static">
                      {blog.category}
                    </span>
                  </div>
                )
              )}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span className="blog-card-author">
                    {blog.author_avatar ? (
                      <img
                        src={blog.author_avatar}
                        alt=""
                        className="blog-card-author-img"
                      />
                    ) : (
                      <span className="blog-card-author-initial">
                        {blog.author ? blog.author.charAt(0).toUpperCase() : "G"}
                      </span>
                    )}
                    {blog.author}
                  </span>
                  {blog.published_at && (
                    <span className="blog-card-date">
                      {" · "}
                      <time dateTime={blog.published_at}>
                        {formatDate(blog.published_at)}
                      </time>
                    </span>
                  )}
                  {blog.read_time && (
                    <span className="blog-card-readtime">
                      {" · "}{blog.read_time} min read
                    </span>
                  )}
                  {blog.views > 0 && (
                    <span className="blog-card-views">
                      {" · "}{blog.views} views
                    </span>
                  )}
                </div>

                <h2 className="blog-card-title">
                  <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h2>

                <p className="blog-card-excerpt">{blog.excerpt}</p>

                {blog.tags && (
                  <div className="blog-card-tags">
                    {blog.tags
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((t, i) => (
                        <span key={i} className="blog-tag-pill">
                          #{t}
                        </span>
                      ))}
                  </div>
                )}

                <div className="blog-card-footer">
                  <Link to={`/blog/${blog.slug}`} className="blog-card-link">
                    Read article <span aria-hidden="true">→</span>
                  </Link>
                  {blog.comments_count > 0 && (
                    <span className="blog-card-comments-count">
                      💬 {blog.comments_count}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {status === "ready" && filteredBlogs.length > 0 && totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            <button
              type="button"
              className="blog-pagination-btn prev-btn"
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              aria-label="Previous page"
            >
              <span aria-hidden="true">←</span> Previous
            </button>

            <div className="blog-pagination-numbers">
              {pageNumbers.map((pageNum, idx) =>
                pageNum === "..." ? (
                  <span key={`ellipsis-${idx}`} className="blog-pagination-ellipsis">
                    …
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    type="button"
                    className={`blog-pagination-page-btn ${safeCurrentPage === pageNum ? "active" : ""}`}
                    onClick={() => handlePageChange(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={safeCurrentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="blog-pagination-btn next-btn"
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              aria-label="Next page"
            >
              Next <span aria-hidden="true">→</span>
            </button>
          </nav>
        )}
      </section>
    </main>
  );
};

export default BlogList;
