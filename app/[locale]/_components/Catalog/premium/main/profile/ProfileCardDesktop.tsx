/**
 * ProfileCardDesktop
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Desktop profile card section composed of a LogoArea and multiple ProfileCard items.
 * - Displays key business identity info such as legal owner, status, type, and industry.
 *
 * Notes:
 * - Imports grouped & alphabetized.
 * - Uses `label` as key instead of array index for stability.
 * - Wrapped in `memo` to avoid unnecessary re-renders.
 */

import React from "react";

// Components
import LogoArea from "./components/LogoArea";
import ProfileCard from "./components/ProfileCard";

// Constants
import { PROFILE_CARDS_DATA } from "./constants/profileCardData";

const ProfileCardDesktop: React.FC = () => {
  return (
    <div className="catalog-pg-profile-card-root">
      <LogoArea />
      {PROFILE_CARDS_DATA.map((card, index) => (
        <ProfileCard
          key={`profile-card-${index}`}
          icon={card.icon}
          label={card.label}
          value={card.value}
          alt={card.alt}
        />
      ))}
    </div>
  );
};

export default ProfileCardDesktop;
