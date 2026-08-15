export default function AppDownload() {
  return (
    <section className="app-download-section flat-spacing-5" style={{ backgroundColor: "#f9f9f9", padding: "80px 0", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @keyframes float-mockup {
          0% { transform: translateY(0px) rotate(-4deg); }
          50% { transform: translateY(-15px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(-4deg); }
        }
        @keyframes float-mockup-delayed {
          0% { transform: translateY(0px) rotate(4deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(4deg); }
        }
        .mockup-front-animated {
          animation: float-mockup 6s ease-in-out infinite;
        }
        .mockup-back-animated {
          animation: float-mockup-delayed 8s ease-in-out infinite 1s;
        }
        .store-btn-animated:hover {
          transform: translateY(-5px) scale(1.05) !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .store-btn-animated {
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .phone-notch {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 22px;
          backgroundColor: #111;
          borderRadius: 0 0 14px 14px;
          zIndex: 10;
        }
      `}</style>
      <div className="container">
        <div className="row align-items-center">
          {/* Mockups Column */}
          <div className="col-lg-6 mb-5 mb-lg-0 text-center text-lg-end pe-lg-5">
            <div className="app-mockups position-relative d-inline-block" style={{ width: '100%', maxWidth: '420px', height: '520px' }}>

              {/* Back phone — Cart screen */}
              <div
                className="mockup-back mockup-back-animated"
                style={{
                  width: '210px',
                  height: '430px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '36px',
                  position: 'absolute',
                  right: '0',
                  top: '40px',
                  border: '8px solid #2a2a2a',
                  boxShadow: '8px 20px 50px rgba(0,0,0,0.25)',
                  overflow: 'hidden',
                  zIndex: 1,
                }}
              >
                {/* Notch */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70px', height: '18px', backgroundColor: '#1a1a1a', borderRadius: '0 0 12px 12px', zIndex: 10 }} />
                <img
                  src="/frontend/assets/images/section/app-screen-cart.jpeg"
                  alt="2DEAL App Cart Screen"
                  style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                />
              </div>

              {/* Front phone — Home screen */}
              <div
                className="mockup-front mockup-front-animated"
                style={{
                  width: '230px',
                  height: '470px',
                  backgroundColor: '#1a1a1a',
                  borderRadius: '40px',
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  zIndex: 2,
                  border: '8px solid #111',
                  boxShadow: '-12px 20px 60px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                }}
              >
                {/* Notch */}
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80px', height: '20px', backgroundColor: '#1a1a1a', borderRadius: '0 0 14px 14px', zIndex: 10 }} />
                <img
                  src="/frontend/assets/images/section/app-screen-home.jpeg"
                  alt="2DEAL App Home Screen"
                  style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
                />
              </div>

            </div>
          </div>

          {/* Content Column */}
          <div className="col-lg-6 text-center text-lg-start ps-lg-5">
            <h2 style={{ fontSize: '38px', fontWeight: '600', color: '#3ec1bc', marginBottom: '15px' }}>Shop Your Favorites On The Go</h2>
            <h4 style={{ fontSize: '22px', fontWeight: '500', color: '#222', marginBottom: '15px' }}>Download our app</h4>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', maxWidth: '400px' }}>
              Where convenience is at your fingertip. Get access to exclusive deals, fast checkout, and personalized recommendations.
            </p>
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 flex-wrap mt-2">
              <a href="https://play.google.com/store/apps/details?id=com.twodeal.consumer&hl=en_IN" target="_blank" rel="noopener noreferrer" className="store-btn store-btn-animated play-store" style={{ display: 'inline-block' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ width: "150px", height: "auto" }} />
              </a>
              <a href="https://apps.apple.com/in/app/2deal/id6747821455" target="_blank" rel="noopener noreferrer" className="store-btn store-btn-animated app-store" style={{ display: 'inline-block' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" style={{ width: "150px", height: "auto" }} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
