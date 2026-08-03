import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bannersAPI } from "@/services/api";
import type { ApiBanner } from "@/services/api";
import { apiImageUrl } from "@/hooks/useApi";

const SESSION_KEY = "sk_offer_shown";

function resolveImg(b: ApiBanner): string {
  return apiImageUrl(b.image_url || b.image);
}

export default function OfferPopup() {
  const [banner, setBanner] = useState<ApiBanner | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    bannersAPI.getOffer()
      .then((res) => {
        const data = res.data.data;
        if (data) {
          setBanner(data);
          // Small delay so page loads first
          setTimeout(() => setVisible(true), 800);
        }
      })
      .catch(() => {});
  }, []);

  function close() {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  }

  if (!banner || !visible) return null;

  const imgSrc = resolveImg(banner);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
          zIndex: 9998, animation: "fadeIn .25s ease",
        }}
      />

      {/* Popup */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 9999,
        width: "min(520px, 92vw)",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        animation: "popIn .3s ease",
      }}>
        {/* Close button */}
        <button
          onClick={close}
          style={{
            position: "absolute", top: 10, right: 12,
            background: "rgba(0,0,0,0.45)", border: "none", borderRadius: "50%",
            color: "#fff", width: 32, height: 32, fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 1, lineHeight: 1,
          }}
          aria-label="Close offer"
        >
          ×
        </button>

        {/* Image */}
        {imgSrc && (
          <img
            src={imgSrc}
            alt={banner.title}
            style={{ width: "100%", display: "block", maxHeight: 380, objectFit: "cover" }}
          />
        )}

        {/* Content */}
        <div style={{ background: "#fff", padding: "20px 24px 24px", textAlign: "center" }}>
          {banner.subtitle && (
            <p style={{ fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "#888", marginBottom: 6 }}>
              {banner.subtitle}
            </p>
          )}
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
            {banner.title}
          </h3>
          <Link
            to={banner.cta_link || "/shop-default"}
            className="tf-btn animate-btn"
            onClick={close}
            style={{ display: "inline-block" }}
          >
            {banner.cta_text || "Shop Now"}
          </Link>
          <p style={{ marginTop: 14, fontSize: 12, color: "#aaa", cursor: "pointer" }} onClick={close}>
            No thanks, I'll pass
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn  { from { opacity:0; transform:translate(-50%,-50%) scale(.88) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
      `}</style>
    </>
  );
}
