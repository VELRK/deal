import { Link } from "react-router-dom";
import { useCollectionBanners, apiImageUrl } from "@/hooks/useApi";

function imgSrc(raw: string): string {
  return apiImageUrl(raw);
}

/* Skeleton while API loads */
function CollectionSkeleton() {
  return (
    <section className="flat-spacing flat-animate-tab-2">
      <div className="container">
        <div className="banner-collect-v01 style-2 st-2_2 tf-grid-layout lg-col-2">
          <div className="col-left" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[80, 60, 60, 60].map((w, i) => (
              <div key={i} style={{ height: 18, width: `${w}%`, background: "#eee", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent)", animation: "sk-sweep 1.4s infinite" }} />
              </div>
            ))}
          </div>
          <div className="col-right">
            <div style={{ aspectRatio: "1/1", background: "#eee", borderRadius: 4, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent)", animation: "sk-sweep 1.4s infinite" }} />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes sk-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </section>
  );
}

function CollectionStyle() {
  const { banners, loading } = useCollectionBanners();

  if (loading) return <CollectionSkeleton />;
  if (!banners.length) return null;

  const accordionId = "bnClsV02";

  return (
    <section className="flat-spacing flat-animate-tab-2">
      <div className="container">
        <div className="banner-collect-v01 style-2 st-2_2 tf-grid-layout lg-col-2">

          {/* Left — accordion tabs */}
          <div className="col-left">
            <div className="heading wow fadeInUp">
              <h3 className="mb-8">Curated Collections For Style</h3>
              <p className="text-body-1 cl-text-2">
                Thoughtfully designed saree collections defining modern elegance.
              </p>
            </div>

            <ul className="list-btn-tab-accordion style-2 wow fadeInUp" role="tablist" id={accordionId}>
              {banners.map((b, idx) => {
                const tabId = `tabCls${idx + 1}`;
                const accordId = `accordionCls${idx + 1}`;
                const isFirst = idx === 0;

                return (
                  <>
                    <li
                      key={b.id}
                      className={`nav-tab-item${isFirst ? " active" : ""}`}
                      role="presentation"
                      data-bs-toggle="tab"
                      data-bs-target={`#${tabId}`}
                    >
                      <div
                        className={`accordion-title${isFirst ? "" : " collapsed"}`}
                        data-bs-target={`#${accordId}`}
                        role="button"
                        data-bs-toggle="collapse"
                        aria-expanded={isFirst ? "true" : "false"}
                        aria-controls={accordId}
                      >
                        <span className="h5 fw-medium">{b.title}</span>
                        <span className="icon icon-ArrowRight" />
                      </div>
                      <div
                        id={accordId}
                        className={`collapse${isFirst ? " show" : ""}`}
                        data-bs-parent={`#${accordionId}`}
                      >
                        <p className="accordion-content cl-text-2">
                          {b.description ?? b.subtitle}
                        </p>
                      </div>
                    </li>
                    {idx < banners.length - 1 && <li key={`br-${idx}`} className="br-line" />}
                  </>
                );
              })}
            </ul>

            <div className="wow fadeInUp">
              <Link to={banners[0]?.cta_link ?? "/shop-default"} className="tf-btn animate-btn">
                {banners[0]?.cta_text ?? "Shop Collections"}
              </Link>
            </div>
          </div>

          {/* Right — tab images */}
          <div className="col-right">
            <div className="tab-content">
              {banners.map((b, idx) => (
                <div
                  key={b.id}
                  className={`tab-pane${idx === 0 ? " active show" : ""}`}
                  id={`tabCls${idx + 1}`}
                  role="tabpanel"
                >
                  <div
                    className="collect-image"
                    style={{ aspectRatio: "1/1", overflow: "hidden" }}
                  >
                    <img
                      loading="lazy"
                      width={705}
                      height={705}
                      src={imgSrc(b.image_url || b.image)}
                      alt={b.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CollectionStyle;
