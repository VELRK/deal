
import { Link } from "react-router-dom";

import bgImage from '../../../../../assets/our-story-bg.png';

function OurStory() {
  return (
    <section className="our-story-section" style={{ backgroundColor: '#FFFDF9', overflow: 'hidden' }}>
      <div className="container-fluid p-0">
        <div className="row g-0 align-items-stretch">
          {/* Left Image Section */}
          <div className="col-lg-6 col-md-12">
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '400px',
              height: '100%',
              // Using the provided image URL or a fallback if needed
              backgroundImage: `url("${bgImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
            </div>
          </div>

          {/* Right Content Section */}
          <div className="col-lg-6 col-md-12 d-flex align-items-center" style={{ position: 'relative' }}>
            {/* Decorative Corner SVG Top-Left */}
            <svg
              viewBox="0 0 100 100"
              style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '120px', opacity: 0.15, transform: 'rotate(0deg)', fill: '#C89B6A', pointerEvents: 'none' }}
            >
              <path d="M10,0 C15,20 30,25 45,15 C50,30 65,35 80,25 C75,45 85,60 70,75 C55,90 40,80 25,95 C15,75 5,60 0,40 C15,35 25,20 10,0 Z" />
            </svg>

            {/* Decorative Corner SVG Top-Right */}
            <svg
              viewBox="0 0 100 100"
              style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', opacity: 0.15, transform: 'scaleX(-1)', fill: '#C89B6A', pointerEvents: 'none' }}
            >
              <path d="M10,0 C15,20 30,25 45,15 C50,30 65,35 80,25 C75,45 85,60 70,75 C55,90 40,80 25,95 C15,75 5,60 0,40 C15,35 25,20 10,0 Z" />
            </svg>

            <div className="story-content" style={{ padding: '10% 12%', maxWidth: '800px', margin: '0 auto', zIndex: 1 }}>
              <h6 style={{
                color: '#C39151',
                textTransform: 'uppercase',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                marginBottom: '20px'
              }}>
                The Golden2Deal Story
              </h6>

              <h2 style={{
                fontFamily: '"Playfair Display", serif',
                color: '#651A24',
                fontSize: '2.8rem',
                fontWeight: 500,
                marginBottom: '30px',
                lineHeight: 1.2
              }}>
                Born of temples, Reborn in your home
              </h2>

              <p style={{
                color: '#4A4A4A',
                fontSize: '15px',
                lineHeight: 1.8,
                marginBottom: '15px',
                fontWeight: 400
              }}>
                For many of us, the scent of incense isn't just a fragrance. It's memory. It's childhood. It's faith. But behind this devotion lies a quiet problem. Temple flowers — once offered with love — often end up as waste, contributing significantly to river pollution.
              </p>

              <p style={{
                color: '#4A4A4A',
                fontSize: '15px',
                lineHeight: 1.8,
                marginBottom: '40px',
                fontWeight: 400
              }}>
                Golden2Deal began with a simple question: Can devotion be made cleaner, safer, and more meaningful?
              </p>

              <Link
                to="/about"
                style={{
                  backgroundColor: '#3ec1bc',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  display: 'inline-block',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#3ec1bc')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3ec1bc')}
              >
                Read Our Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
