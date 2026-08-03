import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useBlogs } from "@/hooks/useApi";
import { ShopPagination } from "@/components/shop/shop-default/ShopListingUi";
import { computePageItems } from "@/components/shop/shop-default/shopLayoutUtils";

const ITEMS_PER_PAGE = 6;

const PLACEHOLDER = "/frontend/assets/images/blog/img-blog-1.jpg";

export default function BlogListingClient() {
  const { blogs, loading } = useBlogs();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE));

  const pageItems = useMemo(
    () => computePageItems(totalPages, currentPage),
    [totalPages, currentPage],
  );

  const visible = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return blogs.slice(start, start + ITEMS_PER_PAGE);
  }, [blogs, currentPage]);

  const { featuredPost, gridPosts } = useMemo(() => {
    if (currentPage === 1 && visible.length > 0) {
      return {
        featuredPost: visible[0],
        gridPosts: visible.slice(1),
      };
    }
    return {
      featuredPost: null,
      gridPosts: visible,
    };
  }, [currentPage, visible]);

  if (loading) {
    return (
      <div className="tf-grid-layout sm-col-2">
        {[...Array(6)].map((_, i) => (
          <article key={i} className="article-blog">
            <div className="blog-image img-style bg-light" style={{ height: 220 }} />
            <div className="blog-content mt-3">
              <div className="bg-light rounded mb-2" style={{ height: 14, width: "40%" }} />
              <div className="bg-light rounded mb-2" style={{ height: 20, width: "80%" }} />
              <div className="bg-light rounded" style={{ height: 14, width: "60%" }} />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (!blogs.length) {
    return <p className="text-muted py-4">No blog posts yet. Check back soon!</p>;
  }

  return (
    <div className="blog-classic-container">
      {featuredPost && (
        <article className="featured-blog-post hover-img mb-5">
          <div className="row align-items-center">
            <div className="col-md-7">
              <Link to={`/blog-single/${featuredPost.slug}`} className="blog-image img-style d-block overflow-hidden">
                <img
                  loading="lazy"
                  className="w-100"
                  style={{ minHeight: "340px", maxHeight: "440px", objectFit: "cover", borderRadius: "16px" }}
                  src={featuredPost.image_url || PLACEHOLDER}
                  alt={featuredPost.title}
                />
              </Link>
            </div>
            <div className="col-md-5">
              <div className="featured-blog-content ps-md-4 mt-3 mt-md-0">
                <p className="entry-date text-caption-01 fw-semibold cl-text-3">
                  FEATURED ARTICLE — {featuredPost.date}
                </p>
                <h3 className="entry-title font-classic mt-2 mb-3">
                  <Link to={`/blog-single/${featuredPost.slug}`} className="link">
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="entry-desc cl-text-2 mb-4">{featuredPost.excerpt}</p>
                <Link to={`/blog-single/${featuredPost.slug}`} className="btn-read-more">
                  Read Article <i className="icon icon-ArrowRight" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      )}

      <div className="tf-grid-layout sm-col-2">
        {gridPosts.map((post) => (
          <article key={post.id} className="article-blog hover-img">
            <Link to={`/blog-single/${post.slug}`} className="blog-image img-style">
              <img
                loading="lazy"
                width={450}
                height={307}
                src={post.image_url || PLACEHOLDER}
                alt={post.title}
              />
            </Link>
            <div className="blog-content">
              <p className="entry-date text-caption-01 fw-semibold cl-text-3">
                LATEST — {post.date}
              </p>
              <h5 className="entry-title font-classic">
                <Link to={`/blog-single/${post.slug}`} className="link">
                  {post.title}
                </Link>
              </h5>
              <p className="entry-desc cl-text-2">{post.excerpt}</p>
              <Link to={`/blog-single/${post.slug}`} className="btn-read-more mt-2">
                Read More <i className="icon icon-ArrowRight" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="wd-full mt-5">
          <ShopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageItems={pageItems}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : null}
    </div>
  );
}
