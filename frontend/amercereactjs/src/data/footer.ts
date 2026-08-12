import type {
  FooterLinkGroup,
  FooterStore,
  FooterPaymentIcon,
} from "@/types/footer";

export const footerStore: FooterStore = {
  supportLabel: "24/7 Support Center:",
  phone: "",
  phoneHref: "#",
  address: "Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong, KL",
  addressHref: "https://maps.google.com/?q=52100+Kepong,+Kuala+Lumpur",
  email: "golden2deal@gmail.com",
};

export const footerCompanyLinks: FooterLinkGroup = {
  title: "COMPANY",
  links: [
    { label: "About Us", href: "/about" },
    // { label: "Our Store",   href: "/our-store" },
    { label: "Contact Us", href: "/contact" },
    { label: "Blog", href: "/blog" },
    { label: "My Account", href: "/account-page" },
  ],
};

export const footerCustomerLinks: FooterLinkGroup = {
  title: "CUSTOMER",
  links: [
    { label: "Track Order",        href: "/track-order" },
    { label: "Return & Refund",    href: "/return-refund" },
    { label: "Privacy Policy",     href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Orders FAQs",        href: "/orders-faq" },
  ],
};

/** Account links for Footer7 (modal triggers) */
export const footerAccountLinksModal: FooterLinkGroup = {
  title: "MY ACCOUNT",
  links: [
    { label: "My Account", href: "/account-page" },
    { label: "Wish List", href: "/wishlist" },
  ],
};

/** Account links for Footer9 (page links) */
export const footerAccountLinksPage: FooterLinkGroup = {
  title: "MY ACCOUNT",
  links: [
    { label: "My Account", href: "/account-page" },
    { label: "My Orders", href: "/account-orders" },
    { label: "Wish List", href: "/wishlist" },
    { label: "View Cart", href: "/view-cart" },
  ],
};

export const footerPaymentIcons: FooterPaymentIcon[] = [
  { src: "/frontend/assets/images/payment/visa.svg", alt: "Visa" },
  { src: "/frontend/assets/images/payment/master-card.svg", alt: "Mastercard" },
  { src: "/frontend/assets/images/payment/amex.svg", alt: "Amex" },
  { src: "/frontend/assets/images/payment/paypal.svg", alt: "PayPal" },
  { src: "/frontend/assets/images/payment/discover.svg", alt: "Discover" },
];
