/**
 * CatalogMobile
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Mobile layout for the premium catalog page composed of smaller presentational sections.
 * - Keep the file minimal: each section is a separate component for readability and testability.
 *
 * Notes:
 * - Imports are grouped and alphabetized (within each group).
 * - Consider dynamic imports if any mobile section becomes heavy.
 */

import React, { memo } from "react";

// Components (alphabetical)
import BannerMobile from "./header/BannerMobile";
import ConnectUsMobile from "./main/ConnectUsMobile";
import OverviewMobile from "./main/profile/OverviewMobile";
import ProductMobile from "./main/product/ProductMobile";
import ProfileCardMobile from "./main/profile/ProfileCardMobile";
import WhyUsMobile from "./main/about/WhyUsMobile";
import InfrastructureMobile from "./main/infrastructure/InfrastructureMobile";
import TestimonialMobile from "./main/testimonials/TestimonialMobile";
import ClienteleMobile from "./main/clientele/ClienteleMobile";

const CatalogMobile: React.FC = () => {
  return (
    <div className="catalog-pg-mobile-root">
      <BannerMobile />

      <ProfileCardMobile />

      <OverviewMobile />

      <ProductMobile />

      <WhyUsMobile />

      <InfrastructureMobile />

      <TestimonialMobile />

      <ClienteleMobile />

      <div className="catalog-pg-mobile-connect-us">
        {/* Keep `data` null for now — pass actual id when available */}
        <ConnectUsMobile data={null} subDomain={"rahul-store"} />
      </div>
    </div>
  );
};

export default memo(CatalogMobile);
