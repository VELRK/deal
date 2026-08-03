import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "@/hooks/useApi";
import type { ApiCategory } from "@/services/api";

export default function CategorySearch({
  parentClass = "form_search-product",
}) {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [isOpen, setIsOpen]     = useState(false);
  const [selected, setSelected] = useState<ApiCategory | null>(null);
  const [query, setQuery]       = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const params = new URLSearchParams();
    params.set("q", q);
    if (selected?.slug) params.set("category_slug", selected.slug);
    navigate(`/shop-default?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <form onSubmit={handleSubmit} className={parentClass}>
      <div className="select-category">
        <div
          className={`tf-select-custom ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected?.name ?? "All Categories"}
        </div>
        <ul className="select-options" style={{ display: isOpen ? "block" : "none" }}>
          <div className="header-select-option">
            <span>Select Category</span>
            <span className="close-option" onClick={() => setIsOpen(false)}>
              <i className="icon-X2" />
            </span>
          </div>
          <li onClick={() => { setSelected(null); setIsOpen(false); }}>
            All Categories
          </li>
          {categories.map((cat) => (
            <li key={cat.id} onClick={() => { setSelected(cat); setIsOpen(false); }}>
              {cat.name}
            </li>
          ))}
        </ul>
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
