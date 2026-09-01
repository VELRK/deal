import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Shop from "@/components/shop/shop-default/Shop";
import PageMeta from "@/components/common/PageMeta";
import { categoriesAPI } from "@/services/api";
import type { ApiCategory } from "@/services/api";
import { apiImageUrl } from "@/hooks/useApi";

export default function Page() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category_slug") ?? "";
  const [category, setCategory] = useState<ApiCategory | null>(null);

  useEffect(() => {
    if (!categorySlug) { setCategory(null); return; }
    categoriesAPI.getAll()
      .then((res) => {
        const all = res.data.data ?? [];
        let found: ApiCategory | null = null;
        const findCat = (cats: ApiCategory[]) => {
          for (const c of cats) {
            if (c.slug === categorySlug) { found = c; return; }
            if (c.children) findCat(c.children);
            if (found) return;
          }
        };
        findCat(all);
        setCategory(found);
      })
      .catch(() => setCategory(null));
  }, [categorySlug]);

  const title = category?.name ?? "Incense Cone Collection";
  //image added banner
  const bgImage = "https://askeva.blr1.cdn.digitaloceanspaces.com/wa.syncr.in/chatbot/6965dd5b1e0e7e164362e98d-2026-09-01T11:25:33.764Z-whole%20product%20banner%20lite.jpg%20(1).jpeg";

  return (
    <>
      <PageMeta title={`${title} | 2Deal`} description="Discover our sacred collection." />
      <style>{`
        /* Global Background Override for Shop Page */
        body {
          background-color: #fdfaf3 !important;
        }
        
        .shop-custom-banner {
          background: linear-gradient(to right, #dbcca8, #f5eadd);
          margin-top: 0;
          border-radius: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
          min-height: 380px;
          position: relative;
        }

        /* ... (previous styles) ... */
        .shop-banner-image-placeholder {
          flex: 1;
          height: 100%;
          min-height: 380px;
          background-color: #d9cec1;
          background-position: left center;
          background-size: cover;
          background-repeat: no-repeat;
          position: relative;
        }

        .shop-banner-content {
          flex: 1.2;
          padding: 40px;
          text-align: center;
          color: #432215;
          position: relative;
          z-index: 2;
        }

        .shop-banner-content h1 {
          font-family: 'Times New Roman', serif;
          font-size: 42px;
          font-style: italic;
          font-weight: 500;
          line-height: 1.2;
          margin-bottom: 15px;
          color: #452417;
        }


        .shop-banner-content h4 {
          font-size: 18px;
          color: #1a5951;
          display: inline-block;
          border-bottom: 1px solid #1a5951;
          padding-bottom: 6px;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .shop-banner-icons {
          display: flex;
          justify-content: center;
          gap: 50px;
        }

        .shop-banner-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .shop-banner-icon-circle {
          width: 50px;
          height: 50px;
          border: 1.5px solid #432215;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shop-banner-icon-item p {
          font-size: 13px;
          line-height: 1.4;
          font-weight: 500;
          margin: 0;
        }

        @media (max-width: 992px) {
          .shop-custom-banner {
            flex-direction: column;
            min-height: auto;
          }
          .shop-banner-image-placeholder {
            width: 100%;
            min-height: 250px;
          }
          .shop-banner-content {
            display: none !important;
          }
        }


        /* Shop Header Overrides */
        .flat-spacing {
          padding-top: 0 !important;
        }
        .tf-shop-control {
          background-color: #fdfaf3 !important;
          padding: 15px 0 !important;
          margin-top: 0 !important;
          margin-bottom: 30px !important;
          box-shadow: none !important;
          border-top: 1px solid #efe5d5 !important;
          border-bottom: 1px solid #efe5d5 !important;
          z-index: 100 !important;
          transition: top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        header.header-sticky ~ * .tf-shop-control,
        header.header-sticky ~ .tf-shop-control {
          top: 85px !important;
        }
        .shop-default-top {
          display: none !important;
        }

      `}</style>

      <div>
        {/* Custom Banner Section */}
        <div className="shop-custom-banner">
          <div
            className="shop-banner-image-placeholder"
            style={{
              backgroundImage: `url("${bgImage}")`
            }}
          ></div>
          <div className="shop-banner-content">
            <h1>Discover<br />2Deal's<br />{category?.name ? `${category.name} Collection` : "Incense Cone Collection"}</h1>
            <h4>Made From Sacred Temple Flowers</h4>

            <div className="shop-banner-icons">
              <div className="shop-banner-icon-item">
                <div className="shop-banner-icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M8 11.5c1.5 0 2.5-1 4-1s2.5 1 4 1" />
                    <path d="M12 15v-4" />
                  </svg>
                </div>
                <p>100%<br />Charcoal Free</p>
              </div>
              <div className="shop-banner-icon-item">
                <div className="shop-banner-icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    <path d="M9 12h6" />
                    <path d="M12 9v6" />
                  </svg>
                </div>
                <p>Crafted By<br />Hand</p>
              </div>
              <div className="shop-banner-icon-item">
                <div className="shop-banner-icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 2v7.31M14 2v7.31M8.5 2h7" />
                    <path d="M14 9.31a4 4 0 1 1-4 0" />
                    <path d="M5 21h14" />
                    <path d="M19 21v-4l-5-4v-4" />
                    <path d="M5 21v-4l5-4v-4" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                </div>
                <p>No Chemicals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Shop Component */}
      <Shop variant={["infinityScroll"]} />
    </>
  );
}
