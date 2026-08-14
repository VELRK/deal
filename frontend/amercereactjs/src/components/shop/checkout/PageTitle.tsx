import { Link } from "react-router-dom";

export default function PageTitle() {
  return (
    <section className="section-page-title text-center flat-spacing-2 pb-0 animate-slide-down">
      <div className="container">
        <div className="main-page-title">
          <div className="breadcrumbs">
            <Link to="/" className="text-caption-01 cl-text-3 link">
              Home
            </Link>
            <i className="icon icon-CaretRightThin cl-text-3" />
            <p className="text-caption-01">Check Out</p>
          </div>
          <h3></h3>
        </div>
      </div>
    </section>
  );
}
