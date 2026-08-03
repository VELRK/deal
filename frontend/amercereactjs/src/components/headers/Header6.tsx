import { Link } from "react-router-dom";

import CategoryNav from "./CategoryNav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";
import AccountIcon from "./AccountIcon";
import CartIconCount from "./CartIconCount";

export default function Header6() {
  const headerSticky = useHeaderSticky();

  return (
    <header
      style={{
        top: headerSticky ? "0px" : "-80px",
        transition: "top 0.3s ease-in-out",
      }}
      className={`tf-header header-s7 scr-box-shadow${headerSticky ? " header-sticky" : ""}`}
    >
      <div className="container-full">
        <div className="header-inner">
          <div className="box-open-menu-mobile d-xl-none">
            <a
              href="#mobileMenu"
              data-bs-toggle="offcanvas"
              className="btn-open-menu"
            >
              <i className="icon icon-List" />
            </a>
          </div>
          <div className="header-left d-none d-xl-flex">
            <Link to={`/`} className="logo-site">
              <img
                loading="lazy"
                width={150}
                height={30}
                src="/frontend/assets/logo/logo.png"
                alt="Image"
              />
            </Link>
            <nav className="box-navigation">
              <ul className="box-nav-menu">
                <CategoryNav />
              </ul>
            </nav>
          </div>
          <div className="header-center d-xl-none">
            <Link to={`/`} className="logo-site">
              <img
                loading="lazy"
                width={150}
                height={30}
                src="/frontend/assets/logo/logo.png"
                alt="Image"
              />
            </Link>
          </div>
          <div className="header-right">
            <ul className="nav-icon-list">
              <li>
                <a
                  href="#search"
                  data-bs-toggle="modal"
                  className="nav-icon-item link"
                >
                  <i className="icon icon-MagnifyingGlass" />
                </a>
              </li>
              <li>
                <AccountIcon />
              </li>
              <li className="d-none d-sm-block">
                <Link to={`/wishlist`} className="nav-icon-item link">
                  <i className="icon icon-HeartStraight" />
                </Link>
              </li>
              <li>
                <a
                  href="#shoppingCart"
                  data-bs-toggle="offcanvas"
                  className="nav-icon-item link shop-cart"
                >
                  <i className="icon icon-Handbag" />
                  <CartIconCount />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
