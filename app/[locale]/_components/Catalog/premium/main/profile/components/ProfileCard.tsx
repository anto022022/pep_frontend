/**
 * ProfileCard
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Small presentational card showing an icon, a label and a value.
 * - Lightweight, accessible, and reusable across desktop/mobile layouts.
 *
 * Notes:
 * - Pass `onClick` to make the whole card interactive (it becomes keyboard-focusable).
 * - Uses Next.js Image for optimized loading. Default image size is configurable via `size`.
 */

import React, { memo } from "react";
import Image from "next/image";

type ProfileCardProps = {
  /** Icon image (StaticImageData from next/image or a string URL) */
  icon: any;
  /** Short title / label for the card */
  label: string;
  /** Primary value or description; can be text or a React node for richer markup */
  value: string | React.ReactNode;
  /** Alt text for the icon — falls back to `label` when not provided */
  alt?: string;
  /** Pixel size for the icon (width and height) */
  size?: number;
  /** Optional click handler — when provided the card becomes interactive (focusable & ARIA role) */
  onClick?: () => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  icon,
  label,
  value,
  alt,
  size = 35,
  onClick,
}) => {
  const altText = alt && alt.trim().length > 0 ? alt : label;
  const isInteractive = typeof onClick === "function";

  return (
    <article
      className={`catalog-pg-profile-card ${
        isInteractive ? "interactive" : ""
      }`}
      role={isInteractive ? "button" : "group"}
      aria-label={label}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <figure className="catalog-pg-profile-card-icon" aria-hidden="true">
        <Image
          src={icon}
          alt={altText}
          width={size}
          height={size}
          loading="lazy"
        />
      </figure>

      <div className="catalog-pg-profile-card-info">
        <div className="catalog-pg-profile-card-label">
          <h4>{label}</h4>
        </div>

        <div className="catalog-pg-profile-card-value">
          {typeof value === "string" ? <p>{value}</p> : value}
        </div>
      </div>
    </article>
  );
};

export default memo(ProfileCard);
