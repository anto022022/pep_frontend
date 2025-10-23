/**
 * OverviewDesktop
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Desktop overview section showing a short description and verification badge.
 * - Lightweight, accessible markup with clear structure and easy extension points.
 *
 * Notes:
 * - Consider extracting copy and badge size into a small config if these vary by site.
 * - If "Know more" should navigate somewhere, pass an `onKnowMore` prop or replace the element with a Link.
 */

import React, { memo } from "react";
import Image from "next/image";

// Assets (alphabetical)
import trueVerifiedBadge from "../../../../../../../public/img/icons/true-verified-partner.svg";

type OverviewDesktopProps = {
  /**
   * Optional handler when user clicks "Know more".
   * If not provided, the label renders as non-interactive text to preserve current behavior.
   */
  onKnowMore?: () => void;
  badgeSize?: number;
};

const DEFAULT_BADGE_SIZE = 100;

const OverviewDesktop: React.FC<OverviewDesktopProps> = ({
  onKnowMore,
  badgeSize = DEFAULT_BADGE_SIZE,
}) => {
  const isInteractive = typeof onKnowMore === "function";

  return (
    <section
      className="catalog-pg-overview-root"
      aria-labelledby="catalog-overview-heading"
    >
      <div className="catalog-pg-overview-content-area">
        <div className="catalog-pg-overview-left">
          <h2
            id="catalog-overview-heading"
            className="catalog-pg-overview-left-title"
          >
            Overview
          </h2>
          <p className="catalog-pg-overview-left-sub">
            Medium length section heading goes here
          </p>
        </div>

        <div className="catalog-pg-overview-right">
          <p className="catalog-pg-overview-right-top-text">
            Use this space to promote the business, its products or its
            services. Help people become familiar with the business and its
            offerings, creating a sense of connection and trust. Focus on what
            makes the business unique and how users can benefit from choosing
            it.
          </p>

          <div className="catalog-pg-badge" aria-hidden={!isInteractive}>
            <Image
              src={trueVerifiedBadge}
              alt="Verified partner badge"
              width={badgeSize}
              height={badgeSize}
              priority={false}
              loading="lazy"
            />
          </div>

          {isInteractive ? (
            <button
              type="button"
              onClick={onKnowMore}
              className="catalog-pg-know-more"
              aria-label="Know more about this business"
            >
              Know more
            </button>
          ) : (
            <div className="catalog-pg-know-more" aria-hidden="true">
              Know more
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(OverviewDesktop);
