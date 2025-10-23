/**
 * ProfileCardMobile
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Mobile carousel/slider for profile cards with accessible controls (prev/next).
 * - MinimalJS slider using CSS transform; keyboard & click accessible.
 *
 * Notes / improvements:
 * - If you want inertia / touch-swipe, consider adding a small swipe handler or use a lightweight carousel lib.
 * - Consider extracting arrows into a small IconButton component if reused elsewhere.
 */

import React, { useCallback, useState } from "react";
import Image from "next/image";

// Components
import LogoArea from "./components/LogoArea";
import ProfileCard from "./components/ProfileCard";

// Constants
import { PROFILE_CARDS_DATA } from "./constants/profileCardData";

// Icons
import arrowLeft from "../../../../../../../public/img/icons/left-icon-profile.svg";
import arrowRight from "../../../../../../../public/img/icons/right-icon-profile.svg";

const ProfileCardMobile: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Navigation handlers with circular logic
  const handlePreviousCard = useCallback(() => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? PROFILE_CARDS_DATA.length - 1 : prevIndex - 1
    );
  }, []);

  const handleNextCard = useCallback(() => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === PROFILE_CARDS_DATA.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  return (
    <div className="catalog-pg-mobile-profile-card-root">
      <LogoArea />

      <div className="catalog-pg-mobile-profile-card-controls">
        {/* Previous Arrow */}
        <div
          className="catalog-pg-mobile-profile-card-arrow left"
          onClick={handlePreviousCard}
          role="button"
          tabIndex={0}
          aria-label="Previous profile card"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handlePreviousCard();
            }
          }}
        >
          <Image src={arrowLeft} alt="Previous" width={15} height={20} />
        </div>

        {/* Carousel Container */}
        <div className="catalog-pg-mobile-profile-card-container">
          <div
            className="catalog-pg-mobile-profile-card-slider"
            style={{ transform: `translateX(-${currentCardIndex * 100}%)` }}
          >
            {PROFILE_CARDS_DATA.map((card, index) => (
              <div
                key={`mobile-profile-card-${index}`}
                className="catalog-pg-mobile-profile-card-slide"
              >
                <ProfileCard
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  alt={card.alt}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Next Arrow */}
        <div
          className="catalog-pg-mobile-profile-card-arrow right"
          onClick={handleNextCard}
          role="button"
          tabIndex={0}
          aria-label="Next profile card"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNextCard();
            }
          }}
        >
          <Image src={arrowRight} alt="Next" width={15} height={20} />
        </div>
      </div>
    </div>
  );
};

export default ProfileCardMobile;
