import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { useCategories, apiImageUrl } from "@/hooks/useApi";

const PLACEHOLDER = "/frontend/assets/images/category/fashion-2/cate-1.jpg";

function catImgSrc(img?: string): string {
  if (!img) return PLACEHOLDER;
  return apiImageUrl(img);
}

const FlowerCorner = ({ style }: { style?: React.CSSProperties }) => (
  <svg width="120" height="120" viewBox="0 0 100 100" style={{ position: "absolute", opacity: 0.15, pointerEvents: "none", ...style }}>
    {/* Stylized flower shape path */}
    <path d="M0,0 Q50,0 50,50 T100,100" fill="none" stroke="#b58742" strokeWidth="2" />
    <path d="M100,0 Q50,0 50,50 T0,100" fill="none" stroke="#b58742" strokeWidth="2" />
    <circle cx="50" cy="50" r="20" fill="none" stroke="#b58742" strokeWidth="2" />
    <path d="M50,30 Q30,10 50,0 Q70,10 50,30Z" fill="none" stroke="#b58742" strokeWidth="2" />
    <path d="M50,70 Q30,90 50,100 Q70,90 50,70Z" fill="none" stroke="#b58742" strokeWidth="2" />
    <path d="M30,50 Q10,30 0,50 Q10,70 30,50Z" fill="none" stroke="#b58742" strokeWidth="2" />
    <path d="M70,50 Q90,30 100,50 Q90,70 70,50Z" fill="none" stroke="#b58742" strokeWidth="2" />
  </svg>
);

/* ── Skeleton card matching the 1:1 category card ── */
function CategorySkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 4, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      {/* Image placeholder — 1:1 ratio */}
      <div style={{
        aspectRatio: "1/1",
        background: "#eeeeee",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          animation: "sk-sweep 1.4s ease-in-out infinite",
        }} />
      </div>
      {/* Name placeholder */}
      <div style={{ padding: "15px", display: "flex", justifyContent: "center" }}>
        <div style={{ height: 16, width: "60%", background: "#eeeeee", borderRadius: 4, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            animation: "sk-sweep 1.4s ease-in-out infinite",
          }} />
        </div>
      </div>
      <style>{`@keyframes sk-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

function Category() {
  const { categories: apiCats, loading } = useCategories();

  /* Show skeleton row while API is in flight */
  if (loading) {
    return (
      <section className="flat-spacing" style={{ backgroundColor: "#fdf9f1", position: "relative", padding: "60px 0" }}>
        <div className="container" style={{ textAlign: "center", marginBottom: "40px" }}>
          <h6 style={{ fontSize: "12px", color: "#b58742", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Shop By Category</h6>
          <h2 style={{ fontSize: "36px", color: "#54101d", fontFamily: "serif", fontWeight: "normal", margin: 0 }}>The Sacred Collection</h2>
        </div>
        <div className="container-layout-right">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = apiCats.map((c) => ({
    name: c.name,
    img: c.image_url ? catImgSrc(c.image_url) : catImgSrc(c.image),
    quantity: c.product_count != null ? `${c.product_count} items` : undefined,
    slug: c.slug,
  }));

  if (!items.length) return null;

  return (
    <section className="flat-spacing" style={{ backgroundColor: "#fdf9f1", position: "relative", overflow: "hidden", padding: "60px 0" }}>
      {/* Decorative Corners */}
      <FlowerCorner style={{ top: -10, left: -10, transform: "scale(1.5)" }} />
      <FlowerCorner style={{ top: -10, right: -10, transform: "scale(1.5) scaleX(-1)" }} />

      <div className="container" style={{ textAlign: "center", marginBottom: "40px", position: "relative", zIndex: 1 }}>
        <h6 style={{ fontSize: "12px", color: "#b58742", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Shop By Category</h6>
        <h2 style={{ fontSize: "36px", color: "#54101d", fontFamily: "serif", fontWeight: "normal", margin: 0 }}>The Sacred Collection</h2>
      </div>

      <div className="container-layout-right tf-btn-swiper-main" style={{ position: "relative", zIndex: 1 }}>
        <TfSwiper
          preview={4.3605}
          tablet={3.3}
          mobileSm={2.3}
          mobile={1.3}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationLg={4}
          paginationDisabled={true}
          externalNavSelectors={{
            prevEl: ".category-swiper-prev",
            nextEl: ".category-swiper-next"
          }}
        >
          {items.map((item, idx) => (
            <div key={idx} style={{ background: "#fff", borderRadius: "4px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              <Link
                to={`/shop-default?category_slug=${item.slug ?? ""}`}
                style={{ display: "block", aspectRatio: "1/1", position: "relative", overflow: "hidden" }}
              >
                {item.img && (item.img.toLowerCase().endsWith('.mp4') || item.img.toLowerCase().endsWith('.webm')) ? (
                  <video
                    src={item.img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={item.img ?? PLACEHOLDER}
                    alt={item.name}
                    width={400}
                    height={400}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                  />
                )}
                {/* Upto 50% Off tag */}
                {/* <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#fff",
                  padding: "4px 10px",
                  fontSize: "11px",
                  borderRadius: "2px",
                  color: "#333",
                  fontWeight: "600",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                  Upto 50% Off
                </div> */}
              </Link>
              <Link
                to={`/shop-default?category_slug=${item.slug ?? ""}`}
                style={{ display: "block", padding: "15px", textAlign: "center", textDecoration: "none" }}
              >
                <h6 style={{ color: "#54101d", fontSize: "16px", fontFamily: "serif", margin: 0, fontWeight: "500" }}>{item.name}</h6>
              </Link>
            </div>
          ))}
        </TfSwiper>
        <div
          className="category-swiper-prev"
          style={{
            position: "absolute",
            top: "calc(50% - 23px)",
            left: "15px",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px solid #eaeaea"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <div
          className="category-swiper-next"
          style={{
            position: "absolute",
            top: "calc(50% - 23px)",
            right: "30px",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px solid #eaeaea"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </section>
  );
}

export default Category;

