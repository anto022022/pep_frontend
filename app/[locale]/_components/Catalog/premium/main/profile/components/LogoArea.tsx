/**
 * LogoArea
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * Purpose:
 * - Small presentational area that displays the catalog logo and an optional label.
 * - Lightweight, accessible, and reusable (accepts overrides via props).
 */

import React, { memo } from "react";
import Image from "next/image";

// Assets (alphabetical)
import logoIcon from "../../../../../../../../public/img/icons/logo-catalog-icon.svg";

type LogoAreaProps = {
  src?: string | any; // StaticImageData from next/image or string URL
  alt?: string;
  label?: string;
  size?: number; // px for width & height (square)
};

const LogoArea: React.FC<LogoAreaProps> = ({
  src = logoIcon,
  alt = "Catalog logo",
  label = "Logo",
  size = 35,
}) => {
  return (
    <div className="catalog-pg-logo-area">
      <figure className="catalog-pg-logo-area-icon" aria-label={label}>
        <Image src={src} alt={alt} width={size} height={size} />
        <figcaption className="catalog-pg-logo-area-label">{label}</figcaption>
      </figure>
    </div>
  );
};

export default memo(LogoArea);
