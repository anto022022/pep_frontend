/**
 * WhyUsCard
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Small presentational card used in the "Why Us" section.
 * - Shows an icon, a title and a value.
 *
 * Notes:
 * - Props are strongly typed.
 * - Uses semantic HTML (article / h4 / p) for better accessibility.
 * - Image `alt` falls back to the label when not provided.
 */

import Image from "next/image";
import React, { memo } from "react";

interface WhyUsCardProps {
  card: {
    icon: string;
    label: string;
    value: string | number;
    alt?: string | null;
  };
}

const WhyUsCard: React.FC<WhyUsCardProps> = ({ card }) => {
  const { icon, label, value, alt } = card;
  const altText = alt && alt.trim().length > 0 ? alt : label;

  return (
    <article
      className="catalog-pg-why-us-card"
      role="group"
      aria-label={`Why us: ${label}`}
    >
      <div className="catalog-pg-why-us-card-icon" aria-hidden="true">
        <Image src={icon} alt={altText} width={35} height={35} />
      </div>

      <h4 className="catalog-pg-why-us-card-title">{label}</h4>

      <p className="catalog-pg-overview-right-top-text" aria-live="polite">
        {value}
      </p>
    </article>
  );
};

export default memo(WhyUsCard);
