import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_NAV_ITEMS } from "./accountNav";
import { useAuthStore } from "@/store/authStore";

export default function AccountSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const renderIcon = (iconName: string) => {
    if (iconName === "icon-Wallet") {
      return (
        <span className="icon" style={{ display: "flex" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </svg>
        </span>
      );
    }
    if (iconName === "icon-star") {
      return (
        <span className="icon" style={{ display: "flex" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      );
    }
    if (iconName === "icon-CreditCard") {
      return (
        <span className="icon" style={{ display: "flex" }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </span>
      );
    }
    return <i className={`icon ${iconName}`} />;
  };



  return (
    <div className="account-sidebar-wrapper">
      <style>{`
        /* Desktop Sidebar View */
        .account-sidebar-desktop {
          display: block;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          padding: 16px 12px;
          margin-bottom: 30px;
          position: sticky;
          top: 100px;
        }

        .my-account-nav-custom {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .link-account-custom {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 18px;
          color: #666666;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          border-radius: 8px;
          background: transparent;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none !important;
          width: 100%;
          text-align: left;
          border: none !important;
        }

        .link-account-custom .icon {
          font-size: 20px;
          color: #888888;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .link-account-custom:hover {
          color: #3ec1bc;
          background: #faf5f6;
        }

        .link-account-custom:hover .icon {
          color: #3ec1bc;
          transform: scale(1.05);
        }

        .link-account-custom.active {
          color: #3ec1bc;
          background: #faf0f2;
          font-weight: 600;
        }

        .link-account-custom.active .icon {
          color: #3ec1bc;
        }

        .logout-btn-custom {
          border-top: 1px dashed rgba(62, 193, 188, 0.15) !important;
          border-radius: 0 !important;
          margin-top: 12px;
          padding-top: 18px;
        }

        /* Mobile Responsive Navigation (Hidden on Desktop) */
        .account-sidebar-mobile {
          display: none;
          margin-bottom: 24px;
        }



        .account-mobile-tabs-row {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          padding: 4px 2px 8px 2px;
        }

        .account-mobile-tabs-row::-webkit-scrollbar {
          display: none; /* Chrome / Safari */
        }

        .account-mobile-tab-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 13.5px;
          font-weight: 500;
          color: #555555;
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 50px;
          white-space: nowrap;
          text-decoration: none !important;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .account-mobile-tab-pill:hover {
          border-color: #3ec1bc;
          color: #3ec1bc;
        }

        .account-mobile-tab-pill.active {
          background: #3ec1bc;
          color: #ffffff;
          border-color: #3ec1bc;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(62, 193, 188, 0.3);
        }

        .account-mobile-tab-pill.active .icon {
          color: #ffffff !important;
        }

        .account-mobile-tab-pill.logout-pill {
          border-color: #fca5a5;
          color: #dc2626;
          background: #fef2f2;
        }

        @media (max-width: 991.98px) {
          .account-sidebar-desktop {
            display: none;
          }
          .account-sidebar-mobile {
            display: block;
          }
        }
      `}</style>

      {/* Desktop View */}
      <div className="account-sidebar-desktop">
        <div className="my-account-nav-custom">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`link-account-custom ${active ? "active" : ""}`}
              >
                {renderIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="link-account-custom logout-btn-custom"
          >
            <i className="icon icon-SignOut" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Bar */}
      <div className="account-sidebar-mobile">


        {/* Horizontal Scrollable Tabs */}
        <div className="account-mobile-tabs-row">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`account-mobile-tab-pill ${active ? "active" : ""}`}
              >
                {renderIcon(item.icon)}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="account-mobile-tab-pill logout-pill"
          >
            <i className="icon icon-SignOut" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

