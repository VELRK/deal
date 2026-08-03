import { Link } from "react-router-dom";
import { useWishlistStore } from "@/store/wishlistStore";
import { useStore } from "@/context/store";
import { useModalStore } from "@/store/modalStore";
import type { ProductCardItem } from "@/types/productCard";
import { formatPrice } from "@/utils/formatPrice";

function WishlistTableRow({
  product,
  removeFromWishlist,
}: {
  product: ProductCardItem;
  removeFromWishlist: (id: string | number) => void;
}) {
  const imgSrc = product.img || "/frontend/assets/images/product/product-1.jpg";

  return (
    <div className="classic-wishlist-item">
      <div className="wishlist-item-image">
        <Link to={`/product-detail/${product.id}`}>
          <img loading="lazy" src={imgSrc} alt={product.name} />
        </Link>
      </div>
      <div className="wishlist-item-details">
        <Link to={`/product-detail/${product.id}`} className="wishlist-item-name">
          {product.name}
        </Link>
        <div className="wishlist-item-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.priceOld && (
            <span className="old-price">{formatPrice(product.priceOld)}</span>
          )}
        </div>
        <div className="wishlist-item-stock">
          <span className="status-dot"></span> In Stock
        </div>
      </div>
      <div className="wishlist-item-actions">
        <button
          type="button"
          className="classic-btn-primary"
          onClick={(e) => {
            e.preventDefault();
            const { setQuickAddItem, setQuickAddProduct } = useStore.getState();
            setQuickAddItem(product.id);
            setQuickAddProduct(product);
            useModalStore.getState().openModal("quickAdd");
          }}
        >
          ADD TO CART
        </button>
        <button
          type="button"
          className="classic-btn-remove"
          onClick={() => removeFromWishlist(product.id)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
          REMOVE
        </button>
      </div>
    </div>
  );
}

function Wishlist() {
  const { items, toggle, loading } = useWishlistStore();
  const removeFromWishlist = (id: string | number) => {
    const product = items.find((p) => p.id === id);
    if (product) toggle(product);
  };

  return (
    <div className="section-wishlist flat-spacing-2">
      <style>{`
        .classic-wishlist-container {
          max-width: 1000px;
          margin: 0 auto;
          font-family: 'Inter', sans-serif;
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .classic-wishlist-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 30px;
        }
        .classic-wishlist-title {
          font-size: 1.5rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #111;
          margin: 0;
        }
        .classic-wishlist-count {
          font-size: 0.9rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .classic-wishlist-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .classic-wishlist-item {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          background: #fff;
          border: 1px solid #f0f0f0;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .classic-wishlist-item:hover {
          border-color: #ddd;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transform: translateY(-2px);
        }
        .wishlist-item-image {
          width: 100px;
          height: 133px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          background: #f9f9f9;
        }
        .wishlist-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .classic-wishlist-item:hover .wishlist-item-image img {
          transform: scale(1.05);
        }
        .wishlist-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .wishlist-item-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: color 0.2s;
        }
        .wishlist-item-name:hover {
          color: #3ec1bc;
        }
        .wishlist-item-price {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .current-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111;
        }
        .old-price {
          font-size: 0.95rem;
          color: #999;
          text-decoration: line-through;
        }
        .wishlist-item-stock {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #15803d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #15803d;
        }
        .wishlist-item-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-end;
          min-width: 160px;
        }
        .classic-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #111;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid #111;
          width: 100%;
        }
        .classic-btn-primary:hover {
          background: #fff;
          color: #111;
        }
        .classic-btn-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          color: #666;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 8px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .classic-btn-remove:hover {
          color: #dc2626;
        }
        .empty-wishlist {
          text-align: center;
          padding: 80px 20px;
          background: #fdfdfd;
          border: 1px dashed #e5e5e5;
          border-radius: 16px;
        }
        .empty-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 24px;
          color: #ccc;
        }
        @media (max-width: 768px) {
          .classic-wishlist-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .wishlist-item-actions {
            width: 100%;
            align-items: stretch;
            flex-direction: row;
            justify-content: space-between;
          }
          .classic-btn-primary {
            flex: 1;
          }
        }
      `}</style>
      <div className="container">
        <div className="classic-wishlist-container">
          <div className="classic-wishlist-header">
            <h2 className="classic-wishlist-title">My Wishlist</h2>
            <span className="classic-wishlist-count">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-secondary" role="status" />
            </div>
          ) : items && items.length > 0 ? (
            <div className="classic-wishlist-list">
              {items.map((product) => (
                <WishlistTableRow
                  key={product.id}
                  product={product as ProductCardItem}
                  removeFromWishlist={removeFromWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="empty-wishlist">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <h3 className="mb-3" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111' }}>Your wishlist is empty</h3>
              <p className="mb-4" style={{ color: '#666', fontSize: '0.95rem' }}>
                You haven't added any products to your wishlist yet.
              </p>
              <Link to="/shop-default" className="classic-btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
                Return to Shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
