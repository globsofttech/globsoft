import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const apiBase = (
  import.meta.env.VITE_ADMIN_PORTAL_URL || "https://adminglobsoft.vercel.app"
).replace(/\/+$/, "");

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://globsoft.vercel.app";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function BlogContent({ content }) {
  if (!content) return null;
  let trimmed = content.trim();
  if (trimmed.startsWith("<")) {
    // Prefix relative /api/ image paths with backend host
    trimmed = trimmed.replace(/src=["']\/api\//g, `src="${apiBase}/api/`);
    return (
      <div
        className="blog-post-content blog-post-richtext"
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }
  return (
    <div className="blog-post-content">
      {trimmed.split(/\r?\n/).map((para, i) =>
        para.trim() ? <p key={i}>{para}</p> : <br key={i} />
      )}
    </div>
  );
}

const BlogPost = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState("loading");
  const [related, setRelated] = useState([]);
  const [copied, setCopied] = useState(false);

  // Comment submission state
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentStatus, setCommentStatus] = useState("idle");
  const [commentError, setCommentError] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  useEffect(() => {
    setBlog(null);
    setStatus("loading");
    setRelated([]);
    setCommentsList([]);

    // Fetch blog post (backend increments views counter atomically)
    fetch(`${apiBase}/api/blogs/${encodeURIComponent(slug)}?fresh=${Date.now()}`, {
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setBlog(data);
        setCommentsList(Array.isArray(data.comments) ? data.comments : []);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));

    // Fetch related articles
    fetch(`${apiBase}/api/blogs/${encodeURIComponent(slug)}/related`, {
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRelated(Array.isArray(data) ? data : []))
      .catch(() => setRelated([]));
  }, [slug]);

  // SEO & Social Meta Tags
  useEffect(() => {
    if (!blog) return;

    const pageTitle = `${blog.seo_title || blog.title} | Globsoft Tech`;
    const desc = blog.seo_description || blog.excerpt;
    const canonical = `${SITE_URL}/blog/${blog.slug}`;
    const ogImage = blog.image_url
      ? (blog.image_url.startsWith("http://") || blog.image_url.startsWith("https://") ? blog.image_url : `${apiBase}${blog.image_url}`)
      : `${SITE_URL}/social-preview.jpg`;

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
    setMeta("property", "og:type", "article");
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:site_name", "Globsoft Tech");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);
    if (blog.author) setMeta("property", "article:author", blog.author);
    if (blog.published_at)
      setMeta("property", "article:published_time", blog.published_at);
    if (blog.updated_at)
      setMeta("property", "article:modified_time", blog.updated_at);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }, [blog]);

  const handleCopyLink = () => {
    const url = `${SITE_URL}/blog/${blog.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    setCommentStatus("submitting");
    setCommentError("");

    try {
      const res = await fetch(`${apiBase}/api/blogs/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: commentName.trim(),
          content: commentText.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit comment.");
      }

      setCommentsList((prev) => [...prev, data.comment]);
      setCommentName("");
      setCommentText("");
      setCommentStatus("success");
      setTimeout(() => setCommentStatus("idle"), 4000);
    } catch (err) {
      setCommentStatus("error");
      setCommentError(err.message || "Failed to submit comment.");
    }
  };

  if (status === "loading") {
    return (
      <main className="blog-page blog-state-page">
        <p className="blog-state">Loading article...</p>
      </main>
    );
  }

  if (status === "error" || !blog) {
    return (
      <main className="blog-page blog-state-page">
        <h1 className="blog-state-title">Article not found</h1>
        <p className="blog-state">
          This article may have been removed or the link is incorrect.
        </p>
        <Link to="/blog" className="blog-back-link">
          ← Back to all articles
        </Link>
      </main>
    );
  }

  return (
    <main className="blog-page blog-post-page">
      <article className="blog-post" itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="headline" content={blog.title} />
        {blog.published_at && (
          <meta itemProp="datePublished" content={blog.published_at} />
        )}
        {blog.updated_at && (
          <meta itemProp="dateModified" content={blog.updated_at} />
        )}

        <div className="blog-post-top-nav">
          <Link className="blog-back-link" to="/blog">
            ← All articles
          </Link>
          {blog.category && (
            <span className="blog-category-badge-inline">{blog.category}</span>
          )}
        </div>

        <header className="blog-post-header">
          <h1 itemProp="name">{blog.title}</h1>

          <div className="blog-post-meta-strip">
            <span className="blog-meta-item">
              {blog.author_avatar ? (
                <img
                  src={blog.author_avatar}
                  alt={blog.author}
                  className="blog-author-avatar-img"
                />
              ) : (
                <span className="blog-author-avatar-chip">
                  {blog.author ? blog.author.charAt(0).toUpperCase() : "G"}
                </span>
              )}
              <strong itemProp="author">{blog.author}</strong>
            </span>

            {blog.published_at && (
              <span className="blog-meta-item">
                <time dateTime={blog.published_at} itemProp="datePublished">
                  {formatDate(blog.published_at)}
                </time>
              </span>
            )}

            {blog.read_time && (
              <span className="blog-meta-item">
                ⚡ {blog.read_time} min read
              </span>
            )}

            {blog.views > 0 && (
              <span className="blog-meta-item">
                👁 {blog.views} views
              </span>
            )}
          </div>

          <p className="blog-post-excerpt" itemProp="description">
            {blog.excerpt}
          </p>
        </header>

        {blog.image_url && (
          <img
            className="blog-post-image"
            src={blog.image_url.startsWith('http://') || blog.image_url.startsWith('https://') || blog.image_url.startsWith('data:') ? blog.image_url : `${apiBase}${blog.image_url}`}
            alt={blog.title}
            itemProp="image"
          />
        )}

        <BlogContent content={blog.content} />

        {/* Tags Section */}
        {blog.tags && (
          <div className="blog-post-tags-section">
            <span className="blog-tags-label">Topics:</span>
            <div className="blog-tags-list">
              {blog.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag, i) => (
                  <span key={i} className="blog-tag-chip">
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Social Share & Copy Link */}
        <footer className="blog-post-footer">
          <div className="blog-share">
            <span className="blog-share-label">Share article</span>
            <div className="blog-share-links">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${SITE_URL}/blog/${blog.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-share-btn blog-share-fb"
                aria-label="Share on Facebook"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${SITE_URL}/blog/${blog.slug}`)}&text=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-share-btn blog-share-tw"
                aria-label="Share on Twitter / X"
              >
                Twitter / X
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${SITE_URL}/blog/${blog.slug}`)}&title=${encodeURIComponent(blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-share-btn blog-share-li"
                aria-label="Share on LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${blog.title} — ${SITE_URL}/blog/${blog.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-share-btn blog-share-wa"
                aria-label="Share on WhatsApp"
              >
                WhatsApp
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`blog-share-btn blog-share-copy ${copied ? "copied" : ""}`}
                aria-label="Copy link"
              >
                {copied ? "✓ Copied!" : "🔗 Copy link"}
              </button>
            </div>
          </div>
        </footer>

        {/* Author Profile Card */}
        <section className="blog-author-profile-box" aria-label="About the author">
          <div className="blog-author-profile-card">
            {blog.author_avatar ? (
              <img
                src={blog.author_avatar}
                alt={blog.author}
                className="blog-author-profile-avatar"
              />
            ) : (
              <div className="blog-author-profile-avatar-fallback">
                {blog.author ? blog.author.charAt(0).toUpperCase() : "G"}
              </div>
            )}
            <div className="blog-author-profile-details">
              <span className="blog-author-profile-tag">Written by</span>
              <h3 className="blog-author-profile-name">{blog.author}</h3>
              <p className="blog-author-profile-bio">
                {blog.author_bio || "Contributing author at Globsoft Tech, sharing practical guides, web engineering insights, and digital growth strategies."}
              </p>
            </div>
          </div>
        </section>

        {/* Related Articles Section (from FlaskBlog) */}
        {related.length > 0 && (
          <section className="blog-related-section" aria-label="Related articles">
            <h2 className="blog-related-heading">More from Globsoft Tech</h2>
            <div className="blog-related-grid">
              {related.map((rel) => (
                <Link
                  to={`/blog/${rel.slug}`}
                  key={rel.id}
                  className="blog-related-card"
                >
                  {rel.image_url && (
                    <img
                      src={rel.image_url.startsWith('http://') || rel.image_url.startsWith('https://') || rel.image_url.startsWith('data:') ? rel.image_url : `${apiBase}${rel.image_url}`}
                      alt={rel.title}
                      loading="lazy"
                      className="blog-related-img"
                    />
                  )}
                  <div className="blog-related-body">
                    {rel.category && (
                      <span className="blog-related-cat">{rel.category}</span>
                    )}
                    <h3>{rel.title}</h3>
                    <span className="blog-related-meta">
                      {rel.read_time ? `${rel.read_time} min read` : "Read article"} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reader Comments Section (from FlaskBlog) */}
        <section className="blog-comments-section" id="comments">
          <h2 className="blog-comments-heading">
            Discussion ({commentsList.length})
          </h2>

          <div className="blog-comments-list">
            {commentsList.length === 0 ? (
              <p className="blog-no-comments">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              commentsList.map((c) => (
                <div className="blog-comment-item" key={c.id}>
                  <div className="blog-comment-avatar">
                    {(c.author_name || "G").charAt(0).toUpperCase()}
                  </div>
                  <div className="blog-comment-body">
                    <div className="blog-comment-header">
                      <strong>{c.author_name}</strong>
                      {c.created_at && (
                        <span>{formatDate(c.created_at)}</span>
                      )}
                    </div>
                    <p className="blog-comment-text">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add a comment form */}
          <form className="blog-comment-form" onSubmit={handleCommentSubmit}>
            <h3>Leave a comment</h3>
            {commentStatus === "success" && (
              <div className="blog-comment-alert success">
                ✓ Thank you! Your comment has been posted.
              </div>
            )}
            {commentStatus === "error" && (
              <div className="blog-comment-alert error">
                {commentError}
              </div>
            )}
            <div className="blog-comment-fields">
              <input
                type="text"
                required
                maxLength={60}
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="blog-comment-input"
              />
              <textarea
                required
                maxLength={1500}
                rows={4}
                placeholder="Write your comment or question here..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="blog-comment-textarea"
              />
              <button
                type="submit"
                disabled={commentStatus === "submitting"}
                className="blog-comment-submit-btn"
              >
                {commentStatus === "submitting" ? "Posting..." : "Post comment"}
              </button>
            </div>
          </form>
        </section>
      </article>
    </main>
  );
};

export default BlogPost;
