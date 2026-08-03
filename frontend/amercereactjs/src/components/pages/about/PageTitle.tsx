import { Link } from "react-router-dom";

function PageTitle() {
  return (
    <>
      <section className="section-page-title text-center flat-spacing-2 pb-0">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link to={`/`} className="text-caption-01 cl-text-3 link">
                Home
              </Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              <p className="text-caption-01">About Us</p>
            </div>
            <h3>About Us</h3>
            <p className="text-body-1 cl-text-2">
              Coimbatore's destination for elegant ethnic fashion, precision tailoring,
              <br className="d-none d-lg-block" />
              and timeless handcrafted Aari embroidery.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
