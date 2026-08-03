import { Link } from "react-router-dom";

function PageTitle() {
  return (
    <section className="section-page-title text-center flat-spacing-2 pb-0">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs d-flex align-items-center justify-content-center gap-1">
            <Link to="/" className="text-caption-01 cl-text-3 link">
              Home
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01 m-0">Return & Refund Policy</p>
          </div>
          <h3 className="mt-3">Return & Refund Policy</h3>
          <p className="text-body-1 cl-text-2 max-w-600 mx-auto mt-2">
            Details about customization terms, sarees exchanges, defect reports, and cancellations.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PageTitle;
