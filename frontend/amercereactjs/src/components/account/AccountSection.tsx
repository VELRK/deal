import { Link } from "react-router-dom";
import AccountSidebar from "./AccountSidebar";

type AccountSectionProps = {
  title: string;
  /** Extra section classes */
  sectionClassName?: string;
  children: React.ReactNode;
  customBreadcrumbs?: React.ReactNode;
  hideSidebar?: boolean;
};

export function AccountSection({
  title,
  sectionClassName = "flat-spacing",
  children,
  customBreadcrumbs,
  hideSidebar = false,
}: AccountSectionProps) {
  return (
    <section className={`account-section-custom ${sectionClassName}`}>
      <style>{`
        .account-section-custom {
          padding-top: 30px;
          padding-bottom: 60px;
        }

        .classic-breadcrumb-wrapper {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .classic-breadcrumb-wrapper a, .classic-breadcrumb-wrapper .breadcrumb-link {
          color: #555;
          text-decoration: none !important;
          transition: color 0.2s ease;
        }
        .classic-breadcrumb-wrapper a:hover, .classic-breadcrumb-wrapper .breadcrumb-link:hover {
          color: #3ec1bc;
        }
        .classic-breadcrumb-wrapper .separator {
          color: #ccc;
          font-size: 11px;
          margin: 0 2px;
          display: inline-block;
        }
        .classic-breadcrumb-wrapper .current {
          color: #111;
          font-weight: 600;
        }

        @media (max-width: 767.98px) {
          .account-section-custom {
            padding-top: 16px !important;
            padding-bottom: 36px !important;
          }
          .classic-breadcrumb-wrapper {
            font-size: 12px;
            margin-bottom: 16px;
            gap: 6px;
          }
        }
      `}</style>
      <div className="container">
        <div className="row">
          {!hideSidebar && (
            <div className="col-lg-3">
              <AccountSidebar />
            </div>
          )}
          <div className={hideSidebar ? "col-lg-12" : "col-lg-9"}>
            {customBreadcrumbs ? (
              <div className="classic-breadcrumb-wrapper">
                {customBreadcrumbs}
              </div>
            ) : (
              <div className="classic-breadcrumb-wrapper">
                <Link to="/">Home</Link>
                <span className="separator">&gt;</span>
                <Link to="/account-page">My Account</Link>
                {title && (
                  <>
                    <span className="separator">&gt;</span>
                    <span className="current">{title}</span>
                  </>
                )}
              </div>
            )}
            <div className={hideSidebar ? "" : "my-account-content"}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

