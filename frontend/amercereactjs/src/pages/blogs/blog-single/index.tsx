import { Link, Navigate, useParams } from "react-router-dom";

import PageMeta from "@/components/common/PageMeta";
import { useBlog, useBlogs } from "@/hooks/useApi";

const PLACEHOLDER = "/frontend/assets/images/blog/img-blog-1.jpg";

export default function BlogSingleDynamicPage() {
  const { id: slug = "" } = useParams<{ id: string }>();
  const { blog, loading, error } = useBlog(slug);
  const { blogs } = useBlogs();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error || !blog) return <Navigate to="/404" replace />;

  const currentIndex = blogs.findIndex((b) => b.slug === slug);
  const prevPost = currentIndex > 0 ? blogs[currentIndex - 1] : null;
  const nextPost = currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null;

  const tagList = blog.tags ? blog.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

  return (
    <>
      <PageMeta
        title={blog.seo?.meta_title || blog.meta_title || `${blog.title} | ShopKart`}
        description={blog.seo?.meta_description || blog.meta_desc || (blog.excerpt ?? blog.title).slice(0, 160)}
        keywords={blog.seo?.meta_keywords || blog.meta_keywords}
        image={blog.seo?.og_image || blog.og_image || blog.image_url || undefined}
        ogType="article"
      />

      {/* Page Title / Breadcrumb */}
      <div className="tf-page-title">
        <div className="container-full">
          <div className="row">
            <div className="col-12">
              <div className="heading text-center font-classic">Blog Detail</div>
              <p className="text-center caption-1 cl-text-2">
                <Link to="/" className="link">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/blog" className="link">Blog</Link>
                <span className="mx-2">/</span>
                <span>{blog.title}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <section className="section-blog-single">
        <div className="main-blog-single">
          <div className="container">
            <div className="row">
              {/* Featured Image */}
              <div className="col-lg-12">
                <div className="blog-image mb-4">
                  <img
                    loading="lazy"
                    width={1410}
                    height={600}
                    style={{ width: "100%", maxHeight: "500px", objectFit: "cover", borderRadius: "12px" }}
                    src={blog.image_url || PLACEHOLDER}
                    alt={blog.title}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="col-lg-8 mx-auto">
                <div className="blog-content">
                  <div className="blog-heading mb-4">
                    {tagList[0] && (
                      <div className="entry-tag fw-medium mb-2">{tagList[0]}</div>
                    )}
                    <h3 className="entry-title font-classic mb-3">{blog.title}</h3>
                    <div className="entry-meta d-flex align-items-center gap-3 flex-wrap">
                      <div className="meta-item d-flex align-items-center gap-1">
                        <i className="icon icon-CalendarBlank" />
                        <span className="text-body-1 cl-text-2">{blog.date}</span>
                      </div>
                      <span className="br-line type-vertical" />
                      <div className="meta-item d-flex align-items-center gap-1">
                        <i className="icon icon-User" />
                        <span className="text-body-1 cl-text-2">by {blog.author || "Indian Ladies Fashion"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body content */}
                  <div className="d-grid gap-16">
                    {blog.excerpt && (
                      <p className="text text-body-1 fw-medium cl-text">{blog.excerpt}</p>
                    )}
                    {blog.content ? (
                      <div
                        className="text text-body-1 cl-text-2 blog-html-content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                      />
                    ) : null}
                  </div>

                  {/* Tags */}
                  {tagList.length > 0 && (
                    <div className="d-flex flex-wrap align-items-center gap-10 mt-5 pt-4 border-top">
                      <span className="fw-semibold">Tags:</span>
                      {tagList.map((tag) => (
                        <Link key={tag} to="/blog" className="tf-btn style-2 btn-sm">
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Prev / Next */}
                  {(prevPost || nextPost) && (
                    <div className="d-flex justify-content-between align-items-start mt-5 pt-4 border-top gap-3">
                      {prevPost ? (
                        <Link to={`/blog-single/${prevPost.slug}`} className="link fw-medium d-flex align-items-center gap-2" style={{ maxWidth: "45%" }}>
                          <i className="icon icon-ArrowLeft flex-shrink-0" />
                          <span>{prevPost.title}</span>
                        </Link>
                      ) : <span />}
                      {nextPost && (
                        <Link to={`/blog-single/${nextPost.slug}`} className="link fw-medium d-flex align-items-center gap-2 text-end" style={{ maxWidth: "45%" }}>
                          <span>{nextPost.title}</span>
                          <i className="icon icon-ArrowRight flex-shrink-0" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
