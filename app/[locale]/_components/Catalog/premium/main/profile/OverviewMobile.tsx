/**
 * OverviewMobile
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Mobile overview section showing a short description and verification badge.
 * - Lightweight, accessible markup with clear structure and easy extension points.
 *
 * Notes:
 * - Imports grouped & alphabetized.
 * - `Know more` can be rendered as plain text or as a button if `onKnowMore` is provided.
 */

import React, { memo } from "react";
import Image from "next/image";

// Assets
import trueVerifiedBadge from "../../../../../../../public/img/icons/true-verified-partner.svg";

type OverviewMobileProps = {
  /** Optional handler when user clicks "Know more". */
  onKnowMore?: () => void;
  /** Badge size in pixels (default: 80). */
  badgeSize?: number;
};

const DEFAULT_BADGE_SIZE = 80;

const OverviewMobile: React.FC<OverviewMobileProps> = ({
  onKnowMore,
  badgeSize = DEFAULT_BADGE_SIZE,
}) => {
  const isInteractive = typeof onKnowMore === "function";

  return (
    <section
      className="catalog-pg-mobile-overview-root"
      aria-labelledby="catalog-overview-mobile-heading"
    >
      <div className="catalog-pg-mobile-overview-content-area">
        <div className="catalog-pg-mobile-overview-left">
          <h2
            id="catalog-overview-mobile-heading"
            className="catalog-pg-mobile-overview-left-title"
          >
            Overview
          </h2>
          <p className="catalog-pg-mobile-overview-left-sub">
            Medium length section heading goes here
          </p>
        </div>

        <div className="catalog-pg-mobile-overview-right">
          <p className="catalog-pg-mobile-overview-right-top-text">
            Use this space to promote the business, its products or its
            services. Help people become familiar with the business and its
            offerings, creating a sense of connection and trust. Focus on what
            makes the business unique and how users can benefit from choosing
            it.
          </p>

          <div className="catalog-pg-mobile-badge">
            <Image
              src={trueVerifiedBadge}
              alt="Verified partner badge"
              width={badgeSize}
              height={badgeSize}
              loading="lazy"
            />
          </div>

          {isInteractive ? (
            <button
              type="button"
              onClick={onKnowMore}
              className="catalog-pg-mobile-know-more"
              aria-label="Know more about this business"
            >
              Know more
            </button>
          ) : (
            <div className="catalog-pg-mobile-know-more" aria-hidden="true">
              Know more
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(OverviewMobile);
