import { Link } from "react-router-dom";
import React from "react";
import { useCategories, apiImageUrl } from "@/hooks/useApi";

const PLACEHOLDER_IMG = "/frontend/assets/images/collection/cls-34.jpg";

function catImgSrc(img?: string): string {
  if (!img) return PLACEHOLDER_IMG;
  return apiImageUrl(img);
}

const STATIC_ITEMS = [
  { name: "Modern Minimalism", img: "/frontend/assets/images/collection/cls-34.jpg", slug: "" },
  { name: "Artisan Craftsmanship", img: "/frontend/assets/images/collection/cls-35.jpg", slug: "" },
  { name: "Sustainable Luxury", img: "/frontend/assets/images/collection/cls-36.jpg", slug: "" },
  { name: "Luxe and Livable", img: "/frontend/assets/images/collection/cls-37.jpg", slug: "" },
  { name: "Confidence in Every Step", img: "/frontend/assets/images/collection/cls-38.jpg", slug: "" },
  { name: "Curated Confidence", img: "/frontend/assets/images/collection/cls-3.jpg", slug: "" },
];

function InfiniteSlide() {
  const { categories, loading } = useCategories();

  const items =
    !loading && categories.length > 0
      ? categories.map((c) => ({
          name: c.name,
          img: catImgSrc(c.image_url ?? c.image),
          slug: c.slug,
        }))
      : STATIC_ITEMS;

  // Duplicate for seamless CSS infinite scroll
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{ backgroundColor: '#fdfcfb', padding: '35px 0', borderTop: '1px solid #f0eee9', borderBottom: '1px solid #f0eee9' }}>
      <style>{`
        .classic-slide-wrap {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 8px 24px;
          border-radius: 50px;
          background: transparent;
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-decoration: none !important;
          cursor: pointer;
        }
        .classic-slide-wrap:hover {
          background: #ffffff;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transform: translateY(-4px);
        }
        .classic-slide-wrap h4 {
          font-family: 'Inter', sans-serif;
          font-size: 17px;
          font-weight: 500;
          color: #4a4a4a;
          margin: 0;
          transition: color 0.3s ease;
          letter-spacing: 0.02em;
        }
        .classic-slide-wrap:hover h4 {
          color: #111;
        }
        .classic-img-wrap {
          overflow: hidden;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .classic-slide-wrap:hover .classic-img-wrap {
          transform: scale(1.15) rotate(8deg);
          border-color: #f0eee9;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}</style>
      <div className="infiniteSlide-cls wow fadeInUp" style={{ padding: 0 }}>
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {repeated.map((item, index) => (
              <React.Fragment key={index}>
                <div className="infiniteSlide-item" style={{ padding: '0 15px' }}>
                  <Link to={`/shop-default?category_slug=${item.slug}`} className="classic-slide-wrap">
                    <h4>{item.name}</h4>
                    <div className="classic-img-wrap">
                      <img
                        loading="lazy"
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          minWidth: "60px",
                          minHeight: "60px",
                          objectFit: "cover",
                          objectPosition: "center top",
                          display: "block",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                    </div>
                  </Link>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfiniteSlide;
