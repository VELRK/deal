import LayoutModals from "@/components/modals";
// import WowInit from "@/components/common/WowInit";
// Fonts: Google Fonts in index.html; --font-* variables in public/assets/scss/abstracts/_variable.scss (parity with next/font/google).
import "./globals.scss";
import ScrollToTop from "@/components/common/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <WowInit /> WOW.js off for now */}
        {children}
        <LayoutModals />
        <ScrollToTop />
      </body>
    </html>
  );
}
