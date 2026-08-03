import { useMemo } from "react";
import { Link } from "react-router-dom";

import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { useBlogs } from "@/hooks/useApi";
import BlogListingClient from "@/components/blogs/blog/BlogListingClient";

function Blog() {
  const { blogs } = useBlogs();

  const recentSidebar = blogs.slice(0, 4);

  // Extract unique tags with counts from all blogs
  const tagCounts = useMemo(() => {
    const map: Record<string, number> = {};
    blogs.forEach((post) => {
      if (!post.tags) return;
      post.tags.split(",").forEach((t) => {
        const tag = t.trim();
        if (tag) map[tag] = (map[tag] || 0) + 1;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [blogs]);

  const popularTags   = tagCounts.slice(0, 10).map(([t]) => t);
  const categoryTags  = tagCounts.slice(0, 5);

  return (
    <>
      <section className="section-blog flat-spacing">
        <h3 className="d-none">Perfect Heading SEO</h3>
        <h4 className="d-none">Perfect Heading SEO</h4>
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <BlogListingClient />
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="blog-sidebar sidebar-content-wrap sticky-top">

                {/* Search */}
                <div className="sidebar-item">
                  <div className="sb-search">
                    <PreventDefaultForm className="form-search-blog">
                      <fieldset>
                        <input
                          className="style-stroke-bottom"
                          type="text"
                          placeholder="Search..."
                          required
                        />
                      </fieldset>
                      <button type="submit" className="btn-action link">
                        <i className="icon icon-MagnifyingGlass" />
                      </button>
                    </PreventDefaultForm>
                  </div>
                </div>

                {/* Categories — built from blog tags */}
                {categoryTags.length > 0 && (
                  <div className="sidebar-item">
                    <h5 className="sb-title">Categories</h5>
                    <ul className="sb-category">
                      {categoryTags.map(([tag, count]) => (
                        <li key={tag}>
                          <Link to="/blog">
                            {tag}
                            <span className="count">({count})</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recent Posts */}
                {recentSidebar.length > 0 && (
                  <div className="sidebar-item">
                    <h5 className="sb-title">Recent Posts</h5>
                    <ul className="sb-recent">
                      {recentSidebar.map((post) => (
                        <li key={post.id} className="recent-item">
                          <Link to={`/blog-single/${post.slug}`} className="image">
                            <img
                              loading="lazy"
                              width={90}
                              height={90}
                              src={post.image_url || "/frontend/assets/images/blog/img-blog-1.jpg"}
                              alt={post.title}
                            />
                          </Link>
                          <div className="meta">
                            <p className="meta-date text-caption-01 cl-text-2">{post.date}</p>
                            <Link to={`/blog-single/${post.slug}`} className="meta-name link-underline link fw-medium">
                              {post.title}
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Popular Tags — built from blog tags */}
                {popularTags.length > 0 && (
                  <div className="sidebar-item">
                    <h5 className="sb-title">Popular Tags</h5>
                    <ul className="sb-tag">
                      {popularTags.map((tag) => (
                        <li key={tag}>
                          <Link to="/blog" className="text-caption-01">{tag}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;
