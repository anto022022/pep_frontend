"use client";

import { useState } from "react";
import FAQSection from "./components/FAQSection";
import FeatureComparison from "./components/FeatureComparison";
import FoundationPlansToggle from "./components/FoundationPlansToggle";
import GrowthPlans from "./components/GrowthPlans";
import PricingHero from "./components/PricingHero";

export default function PricingComponent({ countryId }: { countryId?: string }) {
  const [activePlanType, setActivePlanType] = useState<"grow" | "foundation">(
    "grow"
  );

  const handlePlanTypeChange = (planType: "grow" | "foundation") => {
    setActivePlanType(planType);
  };

  return (
    <div className="pricing-page">
      <PricingHero onPlanTypeChange={handlePlanTypeChange} />

      <div className="plans-container-wrapper">
        {/* FoundationPlansToggle - positioned at top when Foundation is selected */}
        <div
          className={`foundation-plans-section ${
            activePlanType === "foundation" ? "show-at-top" : "show-below"
          }`}
        >
          <FoundationPlansToggle countryId={countryId} />
        </div>

        {/* GrowthPlans - always rendered */}
        <div
          className={`growth-plans-section ${
            activePlanType === "grow" ? "show-at-top" : "show-below"
          }`}
        >
          <GrowthPlans countryId={countryId} />
          <FeatureComparison />
        </div>
      </div>
      {/* <FoundationPlans /> */}
      <FAQSection />
    </div>
  );
}
