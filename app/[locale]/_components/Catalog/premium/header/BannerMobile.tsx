"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import arrowLeft from "../../../../../../public/img/icons/left-icon-carousal-banner.svg";
import arrowRight from "../../../../../../public/img/icons/right-icon-carousal-banner.svg";
import hamburger from "../../../../../../public/img/icons/hamburger-icon.svg";

const BannerMobile = () => {
  const [slides] = useState<string[]>([
    "https://i.ibb.co/GQxTTpND/demon-slayer-kimetsu-no-yaiba-4k-jy.jpg",
    "https://i.ibb.co/kgtZfcDW/Anime-Demon-Slayer-Season3-Finale-1024x576.jpg",
    "https://i.ibb.co/1GbP7L7N/demon-slayer-wallpapers-top-20-demon-slayer-back-by-ifvuojcjkballs-dfwtqcb-fullview.jpg",
    "https://i.ibb.co/G4x5M2Sm/demon-slayer-art-chromebook-wallpaper.jpg",
  ]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const imageUrl = slides[activeIndex];

  return (
    <React.Fragment>
      <section
        className="catalog-pg-mobile-hero"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transition: "opacity 0.5s ease-in-out",
          opacity: isTransitioning ? 0.7 : 1,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <header className="catalog-pg-mobile-header">
          <div className="catalog-pg-mobile-hamburger" aria-hidden>
            <Image src={hamburger} alt="arrow-right" width={45} height={50} />
          </div>
          <button className="catalog-pg-mobile-contact">Contact Us</button>
        </header>
        <div className="catalog-pg-mobile-hero-inner">
          <div className="catalog-pg-mobile-hero-content">
            <h1 className="catalog-pg-mobile-title">
              Title goes here. Use this space to promote the business
            </h1>
            <p className="catalog-pg-mobile-sub">
              Describe the Important features, pricing and other relevant info
            </p>
          </div>

          <div className="catalog-pg-mobile-controls">
            <div
              className="catalog-pg-mobile-arrow left"
              aria-label="previous"
              onClick={handlePrev}
              style={{ cursor: "pointer", display: "none" }}
            >
              <Image src={arrowLeft} alt="arrow-left" width={24} height={24} />
            </div>
            <div
              className="catalog-pg-mobile-arrow right"
              aria-label="next"
              onClick={handleNext}
              style={{ cursor: "pointer", display: "none" }}
            >
              <Image
                src={arrowRight}
                alt="arrow-right"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default BannerMobile;
