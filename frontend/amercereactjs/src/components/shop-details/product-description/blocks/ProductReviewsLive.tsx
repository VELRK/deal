import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reviewsAPI } from "@/services/api";
import type { ApiReview, ApiReviewEligibility } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { apiImageUrl } from "@/hooks/useApi";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="d-flex align-items-center gap-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`icon icon-Star${s <= rating ? "" : ""} fs-14`}
          style={{ color: s <= rating ? "#f4a234" : "#ddd" }}
          aria-hidden
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="d-flex gap-6" style={{ cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ fontSize: 28, color: s <= (hovered || value) ? "#f4a234" : "#ccc", lineHeight: 1 }}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function mediaUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  return apiImageUrl(pathOrUrl);
}

export default function ProductReviewsLive({ productId }: { productId?: number }) {
  const { id: slugParam = "" } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuthStore();
  const { openModal } = useModalStore();
  const numericId = productId ?? Number(slugParam);

  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loadingR, setLoadingR] = useState(true);
  const [eligibility, setEligibility] = useState<ApiReviewEligibility | null>(null);
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!numericId) return;
    setLoadingR(true);
    reviewsAPI.getByProduct(numericId)
      .then((res) => setReviews(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingR(false));
  }, [numericId]);

  useEffect(() => {
    if (!numericId) return;
    if (!isLoggedIn) {
      setEligibility({
        can_review: false,
        reason: "login_required",
        message: "Please log in to write a review.",
      });
      setShowForm(false);
      return;
    }

    setLoadingEligibility(true);
    reviewsAPI.getEligibility(numericId)
      .then((res) => {
        const data = res.data.data ?? { can_review: false };
        setEligibility(data);
        if (!data.can_review) setShowForm(false);
      })
      .catch(() => {
        setEligibility({
          can_review: false,
          reason: "purchase_required",
          message: "Only customers who purchased this product can write a review.",
        });
        setShowForm(false);
      })
      .finally(() => setLoadingEligibility(false));
  }, [numericId, isLoggedIn]);

  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  useEffect(() => {
    if (!video) {
      setVideoPreview(null);
      return;
    }
    const url = URL.createObjectURL(video);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  const avg = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : 0;

  const canReview = eligibility?.can_review === true;

  function resetForm() {
    setTitle("");
    setBody("");
    setRating(5);
    setImages([]);
    setVideo(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || !canReview) return;
    if (images.some((f) => f.size > 5 * 1024 * 1024)) {
      setSubmitMsg({ type: "error", text: "Each photo must be under 5 MB (JPG, PNG, WebP or GIF)." });
      return;
    }
    if (video && video.size > 25 * 1024 * 1024) {
      setSubmitMsg({ type: "error", text: "Video must be under 25 MB (MP4 or WebM)." });
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await reviewsAPI.submit({
        product_id: numericId,
        rating,
        title,
        body,
        images,
        video,
      });
      const mediaCount = res.data?.data?.media?.length ?? 0;
      const wantedMedia = images.length + (video ? 1 : 0);
      if (wantedMedia > 0 && mediaCount === 0) {
        setSubmitMsg({
          type: "error",
          text: res.data.message ?? "Photo/video upload failed. Use JPG/PNG under 5 MB or MP4 under 25 MB.",
        });
        return;
      }
      const partialWarn =
        wantedMedia > 0 && mediaCount > 0 && mediaCount < wantedMedia
          ? ` (${mediaCount}/${wantedMedia} media uploaded)`
          : "";
      setSubmitMsg({
        type: "success",
        text: (res.data.message ?? "Review submitted for approval.") + partialWarn,
      });
      resetForm();
      setEligibility({
        can_review: false,
        reason: "already_reviewed",
        message: "You have already reviewed this product.",
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitMsg({ type: "error", text: msg ?? "Failed to submit review." });
    } finally {
      setSubmitting(false);
    }
  }

  function handleWriteReviewClick() {
    setSubmitMsg(null);
    if (!isLoggedIn) {
      openModal("signIn");
      return;
    }
    if (!canReview) return;
    setShowForm(true);
  }

  function onPickImages(files: FileList | null) {
    if (!files) return;
    const allowedMime = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedExt = ["jpg", "jpeg", "png", "webp", "gif"];
    const picked = Array.from(files);
    const isAllowedImage = (f: File) => {
      const ext = (f.name.split(".").pop() || "").toLowerCase();
      // Prefer extension: Windows/WPS often reports empty or octet-stream for .webp
      if (allowedExt.includes(ext)) return true;
      return allowedMime.includes(f.type) || f.type.startsWith("image/");
    };
    const invalidType = picked.find((f) => !isAllowedImage(f));
    if (invalidType) {
      setSubmitMsg({ type: "error", text: "Photos must be JPG, PNG, WebP or GIF." });
      return;
    }
    const tooBig = picked.find((f) => f.size > 5 * 1024 * 1024);
    if (tooBig) {
      setSubmitMsg({ type: "error", text: `"${tooBig.name}" is over 5 MB. Please choose a smaller photo.` });
      return;
    }
    setSubmitMsg(null);
    const next = [...images, ...picked.filter(isAllowedImage)].slice(0, 5);
    setImages(next);
  }

  function onPickVideo(files: FileList | null) {
    if (!files?.[0]) {
      setVideo(null);
      return;
    }
    const f = files[0];
    if (!f.type.startsWith("video/")) {
      setSubmitMsg({ type: "error", text: "Please choose an MP4 or WebM video." });
      return;
    }
    if (f.size > 25 * 1024 * 1024) {
      setSubmitMsg({ type: "error", text: "Video must be under 25 MB." });
      return;
    }
    setSubmitMsg(null);
    setVideo(f);
  }

  function renderReviewGate() {
    if (loadingEligibility) {
      return <div className="text-muted small">Checking review eligibility…</div>;
    }
    if (canReview) return null;
    if (!isLoggedIn) {
      return (
        <div className="text-muted small">
          Please log in after purchasing to write a review.
        </div>
      );
    }
    if (eligibility?.reason === "already_reviewed") {
      return <div className="text-muted small">{eligibility.message}</div>;
    }
    return (
      <div className="text-muted small">
        {eligibility?.message ?? "Only customers who purchased this product can write a review."}
      </div>
    );
  }

  return (
    <div className="product-desc_review">
      <div className="d-flex align-items-center gap-16 mb-24">
        <div className="text-center">
          <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{avg || "—"}</div>
          <StarDisplay rating={Math.round(avg)} />
          <div className="text-muted small mt-4">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
        </div>
        <div className="ms-auto text-end">
          {!showForm && (
            <button
              type="button"
              className="tf-btn animate-btn btn-sm"
              disabled={isLoggedIn && !canReview && !loadingEligibility}
              onClick={handleWriteReviewClick}
            >
              Write a Review
            </button>
          )}
          <div className="mt-8">{renderReviewGate()}</div>
        </div>
      </div>

      {submitMsg && (
        <div className={`alert alert-${submitMsg.type === "success" ? "success" : "danger"} py-8 px-12 mb-16 text-caption-01`}>
          {submitMsg.text}
        </div>
      )}

      {showForm && canReview && (
        <div className="box-review-form mb-24 p-20" style={{ background: "#f9f9f9", borderRadius: 8 }}>
          <h6 className="mb-16">Your Review</h6>
          <p className="text-muted small mb-12">Only verified buyers can review. You may add up to 5 photos and 1 short video.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-12">
              <label className="tf-lable fw-medium mb-8 d-block">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div className="mb-12">
              <input
                type="text"
                className="form-control"
                placeholder="Review title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ borderRadius: 6, border: "1px solid #ddd", padding: "8px 12px", width: "100%" }}
              />
            </div>
            <div className="mb-16">
              <textarea
                className="form-control"
                rows={4}
                required
                placeholder="Share your experience with this product…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ borderRadius: 6, border: "1px solid #ddd", padding: "8px 12px", width: "100%", resize: "vertical" }}
              />
            </div>
            <div className="mb-12">
              <label className="fw-medium small d-block mb-8">Photos (optional, max 5)</label>
              <div className="d-flex flex-wrap align-items-center gap-10">
                <label
                  className="tf-btn btn-stroke btn-sm mb-0"
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    hidden
                    onChange={(e) => {
                      onPickImages(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  Add photos
                </label>
                <span className="text-muted small">{images.length}/5 selected</span>
              </div>
              {imagePreviews.length > 0 && (
                <div className="d-flex flex-wrap gap-8 mt-10">
                  {imagePreviews.map((src, i) => (
                    <div key={src} style={{ position: "relative" }}>
                      <img src={src} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid #ddd", display: "block" }} />
                      <button
                        type="button"
                        className="btn btn-sm btn-dark"
                        style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, padding: 0, borderRadius: "50%", fontSize: 12, lineHeight: "20px" }}
                        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                        aria-label="Remove photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-16">
              <label className="fw-medium small d-block mb-8">Video (optional, max 25 MB)</label>
              <div className="d-flex flex-wrap align-items-center gap-10">
                <label
                  className="tf-btn btn-stroke btn-sm mb-0"
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    hidden
                    onChange={(e) => {
                      onPickVideo(e.target.files);
                      e.target.value = "";
                    }}
                  />
                  {video ? "Change video" : "Add video"}
                </label>
                {video && <span className="text-muted small">{video.name}</span>}
              </div>
              {videoPreview && (
                <div className="mt-10">
                  <video src={videoPreview} controls style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 6, border: "1px solid #ddd", display: "block" }} />
                  <button type="button" className="tf-btn btn-stroke btn-sm mt-8" onClick={() => setVideo(null)}>
                    Remove video
                  </button>
                </div>
              )}
            </div>
            <div className="d-flex gap-12">
              <button type="submit" className="tf-btn animate-btn btn-sm" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
              <button type="button" className="tf-btn btn-stroke btn-sm" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loadingR ? (
        <div className="text-muted small py-20 text-center">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="text-muted small py-20 text-center">
          No reviews yet.
          {canReview ? " Be the first to review this product!" : ""}
        </div>
      ) : (
        <div className="list-reviews">
          {reviews.map((r) => {
            const imgs = r.images?.length ? r.images : (r.media ?? []).filter((m) => m.media_type === "image");
            const vids = r.videos?.length ? r.videos : (r.media ?? []).filter((m) => m.media_type === "video");
            return (
              <div key={r.id} className="review-item py-16" style={{ borderBottom: "1px solid #eee" }}>
                <div className="d-flex align-items-center gap-12 mb-8">
                  <div
                    className="d-flex align-items-center justify-content-center fw-bold text-white"
                    style={{ width: 40, height: 40, borderRadius: "50%", background: "#2d6a4f", fontSize: 16, flexShrink: 0 }}
                  >
                    {r.user_name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <div className="fw-semibold lh-24">{r.user_name ?? "Customer"}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                  <div className="ms-auto">
                    <StarDisplay rating={r.rating} />
                  </div>
                </div>
                {r.title && <div className="fw-medium mb-4">{r.title}</div>}
                <p className="cl-text-2 text-body-1 mb-0">{r.body}</p>
                {(imgs.length > 0 || vids.length > 0) && (
                  <div className="d-flex flex-wrap gap-8 mt-12">
                    {imgs.map((img, i) => (
                      <a key={img.id ?? i} href={mediaUrl(img.url || img.file_path)} target="_blank" rel="noopener noreferrer">
                        <img
                          src={mediaUrl(img.url || img.file_path)}
                          alt=""
                          style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid #eee" }}
                        />
                      </a>
                    ))}
                    {vids.map((v, i) => (
                      <video
                        key={v.id ?? `v-${i}`}
                        src={mediaUrl(v.url || v.file_path)}
                        controls
                        style={{ width: 160, maxHeight: 120, borderRadius: 6, background: "#000" }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
