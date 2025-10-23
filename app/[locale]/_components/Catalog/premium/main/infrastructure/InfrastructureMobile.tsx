import React, { useState } from "react";
import Image from "next/image";
import briefCaseIcon from "../../../../../../../public/img/briefcase.svg";
import imageUrl from "../../../../../../../public/img/wrapper-dummy.png";
import leftArrowIcon from "../../../../../../../public/img/icons/left-arrow-icon-inf.svg";
import rightArrowIcon from "../../../../../../../public/img/icons/right-arrow-icon-inf.svg";

const InfrastructureMobile = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample images array - you can replace with actual images
  const images = [imageUrl, imageUrl, imageUrl]; // Add more images as needed

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="catalog-pg-infrastructure-mobile-root">
      {/* Carousel section at top */}
      <section className="catalog-pg-infrastructure-mobile-carousel-sec">
        <div className="catalog-pg-infrastructure-mobile-carousel-container">
          <div
            className="catalog-pg-infrastructure-mobile-arrow catalog-pg-infrastructure-mobile-arrow-left"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <Image
              src={leftArrowIcon}
              alt={`leftArrowIcon`}
              width={40}
              height={40}
            />
          </div>

          <div className="catalog-pg-infrastructure-mobile-carousel">
            <Image
              src={images[currentImageIndex]}
              alt={`Infrastructure image ${currentImageIndex + 1}`}
              width={400}
              height={250}
              className="catalog-pg-infrastructure-mobile-carousel-image"
            />
          </div>

          <div
            className="catalog-pg-infrastructure-mobile-arrow catalog-pg-infrastructure-mobile-arrow-right"
            onClick={nextImage}
            aria-label="Next image"
          >
            <Image
              src={rightArrowIcon}
              alt={`rightArrowIcon`}
              width={40}
              height={40}
            />
          </div>
        </div>
      </section>

      {/* Content section at bottom */}
      <section className="catalog-pg-infrastructure-mobile-content-sec">
        <h5 className="catalog-pg-infrastructure-mobile-title">
          Infrastructure
        </h5>
        <p className="catalog-pg-infrastructure-mobile-content">
          Use this space to promote the business, its products or its services.
          Help people become familiar with the business and its offerings,
          creating a sense of connection and trust. Focus on what makes the
          business unique and how users can benefit from choosing it.
        </p>

        <div className="catalog-pg-infrastructure-mobile-card-area-wrapper">
          <div className="catalog-pg-infrastructure-mobile-card-area">
            <Image src={briefCaseIcon} alt="briefcase" width={24} height={24} />
            <h5 className="catalog-pg-infrastructure-mobile-card-title">
              Capacity
            </h5>
            <p className="catalog-pg-infrastructure-mobile-card-description">
              Distributor/Retailer Trader/Exporter
            </p>
          </div>
          <div className="catalog-pg-infrastructure-mobile-card-area">
            <Image src={briefCaseIcon} alt="briefcase" width={24} height={24} />
            <h5 className="catalog-pg-infrastructure-mobile-card-title">
              Capacity
            </h5>
            <p className="catalog-pg-infrastructure-mobile-card-description">
              Distributor/Retailer Trader/Exporter
            </p>
          </div>
          <div className="catalog-pg-infrastructure-mobile-card-area">
            <Image src={briefCaseIcon} alt="briefcase" width={24} height={24} />
            <h5 className="catalog-pg-infrastructure-mobile-card-title">
              Capacity
            </h5>
            <p className="catalog-pg-infrastructure-mobile-card-description">
              Distributor/Retailer Trader/Exporter
            </p>
          </div>
          <div className="catalog-pg-infrastructure-mobile-card-area">
            <Image src={briefCaseIcon} alt="briefcase" width={24} height={24} />
            <h5 className="catalog-pg-infrastructure-mobile-card-title">
              Capacity
            </h5>
            <p className="catalog-pg-infrastructure-mobile-card-description">
              Distributor/Retailer Trader/Exporter
            </p>
          </div>
          <div className="catalog-pg-infrastructure-mobile-card-area">
            <Image src={briefCaseIcon} alt="briefcase" width={24} height={24} />
            <h5 className="catalog-pg-infrastructure-mobile-card-title">
              Capacity
            </h5>
            <p className="catalog-pg-infrastructure-mobile-card-description">
              Distributor/Retailer Trader/Exporter
            </p>
          </div>
          <div className="catalog-pg-infrastructure-mobile-card-area">
            <Image src={briefCaseIcon} alt="briefcase" width={24} height={24} />
            <h5 className="catalog-pg-infrastructure-mobile-card-title">
              Capacity
            </h5>
            <p className="catalog-pg-infrastructure-mobile-card-description">
              Distributor/Retailer Trader/Exporter
            </p>
          </div>
        </div>

        <div className="catalog-pg-infrastructure-mobile-know-more">
          Know more
        </div>
      </section>
    </div>
  );
};

export default InfrastructureMobile;
