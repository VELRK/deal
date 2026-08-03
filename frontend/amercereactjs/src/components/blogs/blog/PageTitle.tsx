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
              <p className="text-caption-01">Blog</p>
            </div>
            <h3 className="font-classic mt-3">Blog</h3>
            <p className="text-body-1 cl-text-2">
              Discover inspiring stories, expert tips, and the latest trends
              designed to keep you
              <br className="d-none d-lg-block" />
              informed, inspired, and always in style.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default PageTitle;
