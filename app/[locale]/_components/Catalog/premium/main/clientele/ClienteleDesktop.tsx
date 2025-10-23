import React, { useRef } from "react";
import Image from "next/image";
import leftArrowIcon from "../../../../../../../public/img/icons/left-arrow-icon-inf.svg";
import rightArrowIcon from "../../../../../../../public/img/icons/right-arrow-icon-inf.svg";
import imageUrl from "../../../../../../../public/img/wrapper-dummy.png";

const ClienteleDesktop = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Width of one logo + gap
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Width of one logo + gap
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
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
    <div className="catalog-pg-clientele-root">
      <div className="catalog-pg-clientele-header">
        <h3 className="catalog-pg-clientele-title">Clientele</h3>
        <div className="catalog-pg-clientele-arrows">
          <div
            className="catalog-pg-clientele-arrow "
            onClick={scrollLeft}
            aria-label="Previous logos"
          >
            <Image src={leftArrowIcon} alt="Previous" width={50} height={50} />
          </div>
          <div
            className="catalog-pg-clientele-arrow"
            onClick={scrollRight}
            aria-label="Next logos"
          >
            <Image src={rightArrowIcon} alt="Next" width={50} height={50} />
          </div>
        </div>
      </div>

      <div className="catalog-pg-clientele-logos" ref={scrollContainerRef}>
        {clientLogos.map((logo, index) => (
          <div key={index} className="catalog-pg-clientele-logo-card">
            <Image
              src={logo.src}
              alt={logo.name}
              width={200}
              height={200}
              className="catalog-pg-clientele-logo"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClienteleDesktop;
