import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useApi";
import type { ApiCategory } from "@/services/api";

export default function CategorySearch({
  parentClass = "form_search-product",
}) {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [query, setQuery]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const params = new URLSearchParams();
    params.set("q", q);
    if (selectedSlug) params.set("category_slug", selectedSlug);
    navigate(`/shop-default?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className={parentClass}>
      <div className="select-category" style={{ position: "relative" }}>
        <select
          className="tf-select-custom"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            border: "none",
            outline: "none",
            background: "transparent",
            cursor: "pointer",
            width: "100%",
            height: "100%",
            padding: "0 30px 0 15px",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--main-color)",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <optgroup label={cat.name} key={cat.id}>
              <option value={cat.slug}>{cat.name} (All)</option>
              {cat.children?.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <span className="br-line type-vertical" />
      <fieldset className="fieldset-search">
        <input
          className="ipt"
          type="text"
          placeholder="Search products…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn-action">
          <i className="icon icon-MagnifyingGlass" />
        </button>
      </fieldset>
    </form>
  );
}
