/**
 * CatalogDesktop
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Desktop layout for the premium catalog page composed of smaller presentational sections.
 * - Keep this file small: each section is a separate component to improve readability and testability.
 *
 * Notes:
 * - Imports are grouped and alphabetized (within each group) for easy scanning.
 * - Consider using `React.lazy` / `next/dynamic` for very large sections if initial bundle size becomes a concern.
 */

import React, { memo } from "react";

// Components (alphabetical)
import Banner from "./header/BannerDesktop";
import ConnectUs from "./main/ConnectUs";
import InfrastructureDesktop from "@/app/[locale]/_components/Catalog/premium/main/infrastructure/InfrastructureDesktop";
import Overview from "./main/profile/OverviewDesktop";
import Product from "./main/product/ProductDesktop";
import ProfileCard from "./main/profile/ProfileCardDesktop";
import WhyUsDesktop from "./main/about/WhyUsDesktop";
import TestimonialDesktop from "./main/testimonials/TestimonialDesktop";
import ClienteleDesktop from "./main/clientele/ClienteleDesktop";

const CatalogDesktop: React.FC = () => {
  return (
    <div className="catalog-pg-root">
      <Banner />

      <ProfileCard />

      <Overview />

      <Product />

      <WhyUsDesktop />

      <InfrastructureDesktop />

      <TestimonialDesktop />

      <ClienteleDesktop />

      <div className="catalog-pg-connect-us">
        {/* Keep `data` null for now — pass actual id when available */}
        <ConnectUs data={null} subDomain={"rahul-store"} />
      </div>
    </div>
  );
};

export default memo(CatalogDesktop);
