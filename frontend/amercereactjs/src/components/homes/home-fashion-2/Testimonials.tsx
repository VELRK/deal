import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { useTestimonials, apiImageUrl } from "@/hooks/useApi";
import { testimonialFashion2Slides } from "@/data/testimonials";
import { formatPrice } from "@/utils/formatPrice";

function Testimonials() {
  const { testimonials, loading } = useTestimonials();

  const hasApi = !loading && testimonials.length > 0;

  return (
    <section className="pt-0 pb-0 mb-0">
      <div className="flat-spacing bg-main">
        <div className="container-full">
          <div className="sect-heading type-2 has-col-right wow fadeInUp">
            <div>
              <h3 className="s-title">What Our Customers Say</h3>
              <p className="s-desc cl-text-2">
                Real stories from people who love our products.
              </p>
            </div>
            <div className="col-right">
              <Link to="/shop-default" className="tf-btn-line-2 py-4 style-primary">
                <span className="fw-semibold">Read All Reviews</span>
              </Link>
            </div>
          </div>

          {hasApi ? (
            <TfSwiper
              preview={3}
              tablet={2}
              mobileSm={1}
              mobile={1}
              spaceLg={40}
              spaceMd={20}
              space={15}
              pagination={1}
              paginationSm={1}
              paginationMd={2}
              paginationLg={3}
              touch={false}
              paginationClassName="sw-line-default style-2 tf-sw-pagination"
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="testimonial-v04 style-2 wow fadeInUp"
                  style={{
                    padding: "24px 20px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    textAlign: "center",
                    border: "1px solid #f3f3f3"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.05)';
                  }}
                >
                  <div className="star-wrap d-flex justify-content-center align-items-center mb-16">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`icon icon-Star${i < t.rating ? "" : "-outline"} fs-16`}
                        style={{ color: "#ffb800", margin: "0 2px" }}
                        aria-hidden
                      />
                    ))}
                  </div>

                  <p className="tes_text h6 mb-20" style={{ fontStyle: "italic", lineHeight: "1.5", color: "#333", fontWeight: "400", fontSize: "14px" }}>
                    "{t.quote}"
                  </p>

                  <div className="tes_author d-flex justify-content-center align-items-center gap-6 mb-16">
                    <h6 className="author-name text-uppercase" style={{ fontSize: "13px", letterSpacing: "0.5px", margin: 0 }}>{t.author_name}</h6>
                    {t.author_title && (
                      <div className="author-verified d-flex align-items-center gap-4">
                        <i className="icon icon-CheckCircle1" style={{ color: "#28a745", fontSize: "14px" }} aria-hidden />
                        <span className="cl-text-2" style={{ fontSize: "12px" }}>{t.author_title}</span>
                      </div>
                    )}
                  </div>

                  <div className="br-line mx-auto mb-16" style={{ width: "40px", height: "1px", backgroundColor: "#e5e5e5" }} />

                  {t.product_id && t.product_name && (
                    <div className="tes_product d-flex justify-content-center align-items-center text-start gap-12" style={{ backgroundColor: "#fafafa", padding: "8px 12px", borderRadius: "8px" }}>
                      <div className="product-image flex-shrink-0">
                        <img
                          src={t.product_image_url ?? apiImageUrl(t.product_thumbnail)}
                          alt={t.product_name}
                          width={45}
                          height={45}
                          style={{ borderRadius: "6px", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </div>
                      <div className="product-infor">
                        <Link
                          to={`/product-detail/${t.product_slug ?? t.product_id}`}
                          className="link-underline-primary fw-semibold lh-20"
                          style={{ fontSize: "13px", color: "#111", display: "block" }}
                        >
                          {t.product_name}
                        </Link>
                        <div className="prd_price text-caption-01" style={{ color: "#666", fontWeight: "500", marginTop: "2px", fontSize: "12px" }}>
                          {formatPrice(Number(t.product_sale_price ?? t.product_price ?? 0))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TfSwiper>
          ) : !loading ? (
            <TfSwiper
              preview={3}
              tablet={2}
              mobileSm={1}
              mobile={1}
              spaceLg={40}
              spaceMd={20}
              space={15}
              pagination={1}
              paginationSm={1}
              paginationMd={2}
              paginationLg={3}
              touch={false}
              paginationClassName="sw-line-default style-2 tf-sw-pagination"
            >
              {testimonialFashion2Slides.map((slide) => (
                <div
                  key={slide.authorName + (slide.product?.name ?? "")}
                  className="testimonial-v04 style-2 wow fadeInUp"
                  style={{
                    padding: "24px 20px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    textAlign: "center",
                    border: "1px solid #f3f3f3"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.05)';
                  }}
                >
                  <div className="star-wrap d-flex justify-content-center align-items-center mb-16">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="icon icon-Star fs-16" style={{ color: "#ffb800", margin: "0 2px" }} aria-hidden />
                    ))}
                  </div>

                  <p className="tes_text h6 mb-20" style={{ fontStyle: "italic", lineHeight: "1.5", color: "#333", fontWeight: "400", fontSize: "14px" }}>
                    "{slide.quote}"
                  </p>

                  <div className="tes_author d-flex justify-content-center align-items-center gap-6 mb-16">
                    <h6 className="author-name text-uppercase" style={{ fontSize: "13px", letterSpacing: "0.5px", margin: 0 }}>{slide.authorName}</h6>
                    {slide.verifiedLabel != null && (
                      <div className="author-verified d-flex align-items-center gap-4">
                        <i className="icon icon-CheckCircle1" style={{ color: "#28a745", fontSize: "14px" }} aria-hidden />
                        <span className="cl-text-2" style={{ fontSize: "12px" }}>{slide.verifiedLabel}</span>
                      </div>
                    )}
                  </div>

                  <div className="br-line mx-auto mb-16" style={{ width: "40px", height: "1px", backgroundColor: "#e5e5e5" }} />

                  {slide.product != null && (
                    <div className="tes_product d-flex justify-content-center align-items-center text-start gap-12" style={{ backgroundColor: "#fafafa", padding: "8px 12px", borderRadius: "8px" }}>
                      <div className="product-image flex-shrink-0">
                        <img src={slide.product.img} alt={slide.product.name} width={45} height={45} style={{ borderRadius: "6px", objectFit: "cover" }} loading="lazy" />
                      </div>
                      <div className="product-infor">
                        <Link to={`/product-detail/${slide.product.id}`} className="link-underline-primary fw-semibold lh-20" style={{ fontSize: "13px", color: "#111", display: "block" }}>
                          {slide.product.name}
                        </Link>
                        <div className="prd_price text-caption-01" style={{ color: "#666", fontWeight: "500", marginTop: "2px", fontSize: "12px" }}>
                          {formatPrice(slide.product.price)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TfSwiper>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
