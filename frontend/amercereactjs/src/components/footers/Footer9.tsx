import { Link } from "react-router-dom";
import { useModalStore } from "@/store/modalStore";
import {
  footerStore,
  footerCompanyLinks,
  footerCustomerLinks,
  footerAccountLinksPage,
  footerPaymentIcons,
} from "@/data/footer";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

export default function Footer9({
  parentClass = "tf-footer footer-s5",
}) {
  const { openModal } = useModalStore();

  const formatTitle = (str: string) => {
    return str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <footer className={`${parentClass} luxury-fashion-footer`} style={{ backgroundColor: "#ECF9F8", padding: "60px 0 30px 0", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        .luxury-fashion-footer {
          background-color: #ECF9F8 !important;
          color: #222222 !important;
          padding: 60px 0 30px 0 !important;
        }
        
        .luxury-footer-body {
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          position: relative;
          padding: 0 !important;
          box-shadow: none !important;
        }

        .luxury-footer-col {
          padding: 0 15px;
          margin-bottom: 30px;
        }

        .footer-brand-info {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        .footer-logo {
          max-width: 100px !important;
          height: auto !important;
          display: block !important;
          margin-bottom: 14px !important;
          border-radius: 50% !important;
        }

        .luxury-tagline {
          font-size: 13px !important;
          color: #555555 !important;
          margin-bottom: 12px !important;
          font-weight: 400 !important;
          line-height: 1.5 !important;
        }

        .luxury-brand-contact {
          font-size: 13px !important;
          color: #555555 !important;
          margin-bottom: 22px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 10px !important;
        }

        .luxury-brand-contact-item {
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
          line-height: 1.4 !important;
        }

        .luxury-brand-contact-item a {
          color: #555555 !important;
          text-decoration: none !important;
          transition: color 0.25s ease !important;
        }

        .luxury-brand-contact-item a:hover {
          color: #3ec1bc !important;
        }

        .luxury-brand-icon {
          color: #3ec1bc !important;
          font-size: 14px !important;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .luxury-social-list {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .luxury-social-link {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 38px !important;
          height: 38px !important;
          border-radius: 50% !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          text-decoration: none !important;
          position: relative !important;
          overflow: hidden !important;
          flex-shrink: 0 !important;
        }

        .luxury-social-link svg {
          display: block;
          transition: transform 0.25s ease;
        }

        /* Real Instagram Brand Color & Glow */
        .luxury-social-link-instagram {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 10px rgba(214, 36, 159, 0.3) !important;
        }
        .luxury-social-link-instagram:hover {
          transform: translateY(-3px) scale(1.08) !important;
          box-shadow: 0 7px 18px rgba(214, 36, 159, 0.55) !important;
        }
        .luxury-social-link-instagram:hover svg {
          transform: scale(1.1);
        }

        /* Real Facebook Brand Color & Glow */
        .luxury-social-link-facebook {
          background-color: #1877F2 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 10px rgba(24, 119, 242, 0.3) !important;
        }
        .luxury-social-link-facebook:hover {
          background-color: #166fe5 !important;
          transform: translateY(-3px) scale(1.08) !important;
          box-shadow: 0 7px 18px rgba(24, 119, 242, 0.55) !important;
        }
        .luxury-social-link-facebook:hover svg {
          transform: scale(1.1);
        }

        /* Real TikTok Brand Color & Glow */
        .luxury-social-link-tiktok {
          background-color: #010101 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.35) !important;
        }
        .luxury-social-link-tiktok:hover {
          background-color: #000000 !important;
          transform: translateY(-3px) scale(1.08) !important;
          box-shadow: -2px -2px 12px rgba(37, 244, 238, 0.65), 2px 2px 12px rgba(254, 44, 85, 0.65) !important;
        }
        .luxury-social-link-tiktok:hover svg {
          transform: scale(1.1);
        }

        .luxury-footer-heading {
          color: #111111 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          margin-bottom: 20px !important;
          text-transform: capitalize !important;
          letter-spacing: 0.05em !important;
          position: relative !important;
          display: block !important;
          width: 100% !important;
          border-bottom: none !important;
        }

        .luxury-footer-heading::after {
          display: none !important;
        }

        .luxury-footer-links {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .luxury-footer-links li {
          margin-bottom: 10px !important;
        }

        .luxury-footer-link {
          color: #555555 !important;
          font-size: 13px !important;
          text-decoration: none !important;
          transition: all 0.25s ease !important;
          display: inline-block !important;
        }

        .luxury-footer-link:hover {
          color: #3ec1bc !important;
          transform: translateX(4px) !important;
        }

        .luxury-footer-bottom {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          padding-top: 25px !important;
          border-top: 1px solid rgba(193, 16, 105, 0.08) !important;
          margin-top: 30px !important;
          gap: 15px !important;
        }

        .luxury-copyright {
          font-size: 12px !important;
          color: #666666 !important;
          margin: 0 !important;
          text-align: center !important;
          letter-spacing: 0.02em !important;
        }

        .luxury-payment-list {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .luxury-payment-list img {
          opacity: 0.85 !important;
          transition: all 0.3s ease !important;
          border-radius: 3px;
          width: 38px !important;
          height: 24px !important;
        }

        .luxury-payment-list img:hover {
          opacity: 1 !important;
          transform: scale(1.08) !important;
        }

        @media (max-width: 767px) {
          .luxury-fashion-footer {
            padding: 40px 0 20px 0 !important;
          }
          .luxury-footer-col {
            margin-bottom: 0px !important;
          }
          .footer-brand-info {
            align-items: center !important;
            text-align: center !important;
            margin-bottom: 30px !important;
          }
          .luxury-social-list {
            justify-content: center !important;
          }
        }

        @media (max-width: 575px) {
          .luxury-footer-heading {
            position: relative !important;
            padding-right: 20px !important;
            margin-bottom: 0 !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
            border-bottom: 1px solid rgba(62, 193, 188, 0.15) !important;
            color: #111111 !important;
            font-size: 15px !important;
          }

          .luxury-footer-heading::before {
            content: "+";
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #3ec1bc;
            font-size: 20px;
            transition: transform 0.3s ease;
            font-weight: 400;
          }
          
          .footer-col-block.open .luxury-footer-heading::before {
            content: "−";
            transform: translateY(-50%) rotate(180deg);
          }

          .footer-col-block .tf-collapse-content {
            display: none;
          }

          .footer-col-block.open .tf-collapse-content {
            display: block;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
            border-bottom: 1px solid rgba(62, 193, 188, 0.08) !important;
          }
        }
      `}</style>

      {/* ── Main footer links ── */}
      <div className="container">
        <div className="luxury-footer-body">

          <FooterAccordionWrapper>
            <div className="row">

              {/* Brand block (Logo, Tagline, Contact Info, Socials) */}
              <div className="col-lg-3 col-md-6 luxury-footer-col">
                <div className="footer-brand-info">
                  <Link to="/" className="logo-site mb-16 d-block">
                    <img
                      loading="lazy"
                      width={100}
                      src="/frontend/assets/logo/logo.png"
                      alt="2Deal"
                      className="footer-logo"
                    />
                  </Link>
                  <p className="luxury-tagline"></p>

                  <div className="luxury-brand-contact">

                    {footerStore.phone && (
                      <div className="luxury-brand-contact-item">
                        <span className="luxury-brand-icon">📞</span>
                        <a href={footerStore.phoneHref}>
                          {footerStore.phone}
                        </a>
                      </div>
                    )}

                    <div className="luxury-brand-contact-item">
                      <span className="luxury-brand-icon">✉️</span>
                      <a href={`mailto:${footerStore.email}`}>
                        {footerStore.email}
                      </a>
                    </div>
                  </div>

                  <ul className="luxury-social-list">
                    <li>
                      <a
                        href="https://www.instagram.com/2deal.my/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="luxury-social-link luxury-social-link-instagram"
                        aria-label="Instagram - @2deal.my"
                        title="Instagram: @2deal.my"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.facebook.com/people/2-Deal/61561777914233/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="luxury-social-link luxury-social-link-facebook"
                        aria-label="Facebook - 2-Deal"
                        title="Facebook: 2-Deal"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="#ffffff"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.tiktok.com/@dileep.krish?_r=1&_t=ZS-99bwWWlkBcn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="luxury-social-link luxury-social-link-tiktok"
                        aria-label="TikTok - @dileep.krish"
                        title="TikTok: @dileep.krish"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          {/* Authentic TikTok Cyan offset layer */}
                          <path
                            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.89 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.34-6.32V8.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86.37z"
                            fill="#25F4EE"
                            transform="translate(-0.8, -0.4)"
                          />
                          {/* Authentic TikTok Magenta/Red offset layer */}
                          <path
                            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.89 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.34-6.32V8.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86.37z"
                            fill="#FE2C55"
                            transform="translate(0.8, 0.4)"
                          />
                          {/* TikTok crisp white front layer */}
                          <path
                            d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.89 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.33 6.33 0 0 0 6.34-6.32V8.2a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.86.37z"
                            fill="#FFFFFF"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Company */}
              <div className="col-lg-3 col-md-6 luxury-footer-col">
                <FooterAccordionItem
                  id="footer9-company"
                  className="footer-col-block"
                  heading={formatTitle(footerCompanyLinks.title)}
                  headingClassName="luxury-footer-heading"
                >
                  <ul className="luxury-footer-links">
                    {footerCompanyLinks.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link to={link.href} className="luxury-footer-link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/affiliate" className="luxury-footer-link">
                        Become an Affiliate
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="luxury-footer-link bg-transparent border-0 p-0 text-start"
                        onClick={() => openModal("affiliateEnquiry")}
                      >
                        Affiliate Enquiry
                      </button>
                    </li>
                  </ul>
                </FooterAccordionItem>
              </div>

              {/* Customer */}
              <div className="col-lg-3 col-md-6 luxury-footer-col">
                <FooterAccordionItem
                  id="footer9-customer"
                  className="footer-col-block"
                  heading={formatTitle(footerCustomerLinks.title)}
                  headingClassName="luxury-footer-heading"
                >
                  <ul className="luxury-footer-links">
                    {footerCustomerLinks.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link to={link.href} className="luxury-footer-link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterAccordionItem>
              </div>

              {/* Account */}
              <div className="col-lg-3 col-md-6 luxury-footer-col">
                <FooterAccordionItem
                  id="footer9-account"
                  className="footer-col-block"
                  heading={formatTitle(footerAccountLinksPage.title)}
                  headingClassName="luxury-footer-heading"
                >
                  <ul className="luxury-footer-links">
                    {footerAccountLinksPage.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link to={link.href} className="luxury-footer-link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterAccordionItem>
              </div>

            </div>
          </FooterAccordionWrapper>

          {/* ── Footer bottom bar ── */}
          <div className="luxury-footer-bottom">
            <p className="luxury-copyright">
              ©{new Date().getFullYear()} 2Deal. All Rights Reserved.
            </p>
            <ul className="luxury-payment-list">
              {footerPaymentIcons.map((icon) => (
                <li key={icon.src}>
                  <img src={icon.src} alt={icon.alt} width={38} height={24} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </footer>
  );
}
