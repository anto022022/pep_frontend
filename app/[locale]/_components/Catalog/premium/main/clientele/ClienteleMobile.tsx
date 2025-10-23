import React, { useState } from "react";
import Image from "next/image";
import leftArrowIcon from "../../../../../../../public/img/icons/left-arrow-icon-inf.svg";
import rightArrowIcon from "../../../../../../../public/img/icons/right-arrow-icon-inf.svg";
import imageUrl from "../../../../../../../public/img/wrapper-dummy.png";

const ClienteleMobile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextLogo = () => {
    setCurrentIndex((prev) => (prev + 1) % clientLogos.length);
  };

  const prevLogo = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + clientLogos.length) % clientLogos.length
    );
  };

  const clientLogos = [
    { name: "TechCorp", src: imageUrl },
    { name: "Global Industries", src: imageUrl },
    { name: "InnovateTech", src: imageUrl },
    { name: "Future Dynamics", src: imageUrl },
    { name: "NextGen Enterprises", src: imageUrl },
    { name: "Strategic Solutions", src: imageUrl },
    { name: "Advanced Systems", src: imageUrl },
    { name: "Digital Partners", src: imageUrl },
    { name: "Cloud Solutions", src: imageUrl },
    { name: "Data Analytics", src: imageUrl },
    { name: "AI Innovations", src: imageUrl },
    { name: "Blockchain Tech", src: imageUrl },
  ];

  return (
    <div className="catalog-pg-clientele-mobile-root">
      <div className="catalog-pg-clientele-mobile-header">
        <h3 className="catalog-pg-clientele-mobile-title">Clientele</h3>
        <div className="catalog-pg-clientele-mobile-arrows">
          <div
            className="catalog-pg-clientele-mobile-arrow catalog-pg-clientele-mobile-arrow-left"
            onClick={prevLogo}
            aria-label="Previous logo"
          >
            <Image src={leftArrowIcon} alt="Previous" width={50} height={50} />
          </div>
          <div
            className="catalog-pg-clientele-mobile-arrow catalog-pg-clientele-mobile-arrow-right"
            onClick={nextLogo}
            aria-label="Next logo"
          >
            <Image src={rightArrowIcon} alt="Next" width={50} height={50} />
          </div>
        </div>
      </div>

      <div className="catalog-pg-clientele-mobile-container">
        <div className="catalog-pg-clientele-mobile-logo-card">
          <Image
            src={clientLogos[currentIndex].src}
            alt={clientLogos[currentIndex].name}
            width={200}
            height={200}
            className="catalog-pg-clientele-mobile-logo"
          />
        </div>

        {/* <div className="catalog-pg-clientele-mobile-dots">
          {clientLogos.map((_, index) => (
            <button
              key={index}
              className={`catalog-pg-clientele-mobile-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to logo ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default ClienteleMobile;
