/**
 * WhyUsMobile
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Mobile "Why Us" section composed of WhyUsCard components.
 * - Small, accessible, and easy-to-read layout with stable keys for list items.
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
  icon: string | any; // supports StaticImageData from next/image or string URL
  label: string;
  value: string;
  alt?: string;
};

const WhyUsMobile: React.FC = () => {
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
    <section
      className="catalog-pg-mobile-why-us-root"
      aria-labelledby="why-us-mobile-heading"
    >
      <div className="catalog-pg-mobile-why-us-content-area">
        <div className="catalog-pg-mobile-why-us-left">
          <h2
            id="why-us-mobile-heading"
            className="catalog-pg-mobile-why-us-title"
          >
            Why Us
          </h2>
          <p className="catalog-pg-mobile-why-us-description">
            Use this space to promote the business, its products or its
            services. Help people become familiar with the business and its
            offerings, creating a sense of connection and trust. Focus on what
            makes the business unique and how users can benefit from choosing
            it.
          </p>
        </div>
      </div>

      <div
        className="catalog-pg-mobile-why-us-card-area"
        role="list"
        aria-label="Why us features"
      >
        {whyUsCards.map((card, index) => {
          // create a stable key using label + index (labels are expected to be unique-ish)
          const key = `${card.label
            .replace(/\s+/g, "-")
            .toLowerCase()}-${index}`;

          return (
            <div
              key={key}
              className="catalog-pg-mobile-why-us-card-container"
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

export default memo(WhyUsMobile);
