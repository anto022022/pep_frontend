"use client";
import React, { useState } from "react";
import Image from "next/image";
import arrowLeft from "../../../../../../public/img/icons/left-icon-carousal-banner.svg";
import arrowRight from "../../../../../../public/img/icons/right-icon-carousal-banner.svg";
const Banner = () => {
  const [slides] = useState<string[]>([
    "https://i.ibb.co/GQxTTpND/demon-slayer-kimetsu-no-yaiba-4k-jy.jpg",
    "https://i.ibb.co/kgtZfcDW/Anime-Demon-Slayer-Season3-Finale-1024x576.jpg",
    "https://i.ibb.co/1GbP7L7N/demon-slayer-wallpapers-top-20-demon-slayer-back-by-ifvuojcjkballs-dfwtqcb-fullview.jpg",
    "https://i.ibb.co/G4x5M2Sm/demon-slayer-art-chromebook-wallpaper.jpg",
  ]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const imageUrl = slides[activeIndex];

  return (
    <React.Fragment>
      <header className="catalog-pg-header">
        <div className="catalog-pg-nav">
          <div className="catalog-pg-tab">Profile</div>
          <div className="catalog-pg-tab">Products</div>
          <div className="catalog-pg-tab">Infrastructure</div>
          <div className="catalog-pg-tab">Feed</div>
        </div>

        <div className="catalog-pg-contact">Contact Us</div>
      </header>

      <section
        className="catalog-pg-hero"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transition: "opacity 0.5s ease-in-out",
          opacity: isTransitioning ? 0.7 : 1,
        }}
      >
        <div className="catalog-pg-hero-inner">
          <aside className="catalog-pg-carousel-controls" aria-hidden>
            <div
              className="catalog-pg-arrow left"
              aria-label="previous"
              onClick={handlePrev}
              style={{ cursor: "pointer" }}
            >
              <Image src={arrowLeft} alt="arrow-left" width={24} height={24} />
            </div>
            <div
              className="catalog-pg-arrow right"
              aria-label="next"
              onClick={handleNext}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={arrowRight}
                alt="arrow-right"
                width={24}
                height={24}
              />
            </div>
          </aside>

          <div className="catalog-pg-hero-content">
            <h1 className="catalog-pg-title">
              Title goes here. Use this space to promote the business
            </h1>
            <p className="catalog-pg-sub">
              Describe the Important features, pricing and other relevant info
            </p>
          </div>
        </div>
      </section>

      {/* <section className="catalog-pg-info">
        <div className="catalog-pg-info-inner">
          <div className="catalog-pg-logo-card">
            <div className="catalog-pg-logo-placeholder">Logo</div>
          </div>

          <div className="catalog-pg-divider" />

          <div className="catalog-pg-features">
            <div className="catalog-pg-feature">
              <div className="catalog-pg-icon" />
              <div className="catalog-pg-text">
                <div className="catalog-pg-feature-title">Legal Owner Name</div>
                <div className="catalog-pg-feature-sub">Owner name</div>
              </div>
            </div>

            <div className="catalog-pg-feature">
              <div className="catalog-pg-icon" />
              <div className="catalog-pg-text">
                <div className="catalog-pg-feature-title">Legal Status</div>
                <div className="catalog-pg-feature-sub">
                  Legal status of company
                </div>
              </div>
            </div>

            <div className="catalog-pg-feature">
              <div className="catalog-pg-icon" />
              <div className="catalog-pg-text">
                <div className="catalog-pg-feature-title">Business Type</div>
                <div className="catalog-pg-feature-sub">Type of business</div>
              </div>
            </div>

            <div className="catalog-pg-feature">
              <div className="catalog-pg-icon" />
              <div className="catalog-pg-text">
                <div className="catalog-pg-feature-title">Industry</div>
                <div className="catalog-pg-feature-sub">
                  Industry you are into
                </div>
              </div>
            </div>
          </div>

          <div className="catalog-pg-side-arrow" aria-hidden>
            ›
          </div>
        </div>
      </section> */}
    </React.Fragment>
  );
};

export default Banner;
