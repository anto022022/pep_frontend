/**
 * WhyUsDesktop
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Desktop "Why Us" section composed of several small WhyUsCard components.
 * - Clean, accessible markup and consistent keys for mapped items.
 *
 * Notes:
 * - Imports are grouped & alphabetized.
 * - Wrapped in `memo` to avoid unnecessary re-renders.
 */

import React, { memo } from "react";

// Components (alphabetical)
import WhyUsCard from "@/app/[locale]/_components/Catalog/premium/main/about/WhyUsCard";

// Assets (alphabetical)
import badgeCheckIcon from "../../../../../../../public/img/icons/badge-check.svg";

type WhyUsItem = {
  icon: string | any; // keep `any` for StaticImageData from next/image or string
  label: string;
  value: string;
  alt?: string;
};

const WhyUsDesktop: React.FC = () => {
  const whyUsCards: WhyUsItem[] = [
    {
      icon: badgeCheckIcon,
      label: "Feature One",
      value: "Use this space to promote the business",
      alt: "badge-check",
    },
    {
      icon: badgeCheckIcon,
      label: "Feature Two",
      value: "Use this space to promote the business",
      alt: "badge-check",
    },
    {
      icon: badgeCheckIcon,
      label: "Feature Three",
      value: "Use this space to promote the business",
      alt: "badge-check",
    },
    {
      icon: badgeCheckIcon,
      label: "Feature Four",
      value: "Use this space to promote the business",
      alt: "badge-check",
    },
  ];

  return (
    <section className="catalog-pg-white-sec" aria-labelledby="why-us-heading">
      <div className="catalog-pg-why-us-content-area">
        <div className="catalog-pg-overview-left">
          <h2 id="why-us-heading" className="catalog-pg-white-sec-title">
            Why Us
          </h2>
          <p className="catalog-pg-overview-right-top-text">
            Use this space to promote the business, its products or its
            services. Help people become familiar with the business and its
            offerings, creating a sense of connection and trust. Focus on what
            makes the business unique and how users can benefit from choosing
            it.
          </p>
        </div>

        {/* Right column placeholder for future content, kept for layout consistency */}
        <aside className="catalog-pg-overview-right" aria-hidden="true" />
      </div>

      <div
        className="catalog-pg-why-us-card-area"
        role="list"
        aria-label="Why us features"
      >
        {whyUsCards.map((card, i) => {
          // Use label + index to avoid accidental duplicate-key collisions while keeping keys stable
          const key = `${card.label.replace(/\s+/g, "-").toLowerCase()}-${i}`;

          return (
            <div
              key={key}
              className="catalog-pg-why-us-card-container"
              role="listitem"
            >
              <WhyUsCard card={card} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(WhyUsDesktop);
