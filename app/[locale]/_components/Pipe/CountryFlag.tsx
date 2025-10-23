import Image, { StaticImageData } from "next/image";
import React from "react";

import China from "@/assets/img/countryFlag/china.png";
import India from "@/assets/img/countryFlag/india.png";
import Japan from "@/assets/img/countryFlag/japan.png";
import SouthAfrica from "@/assets/img/countryFlag/south-africa.png";
import SriLanka from "@/assets/img/countryFlag/srilanka.png";
import UAE from "@/assets/img/countryFlag/uae.png";
import USA from "@/assets/img/countryFlag/usa.png";

interface CountryFlagProps {
  countryCode: string;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

const countryFlagMap: Record<string, StaticImageData> = {
  IN: India,
  CN: China,
  JP: Japan,
  ZA: SouthAfrica,
  LK: SriLanka,
  AE: UAE,
  US: USA,
};

const CountryFlag: React.FC<CountryFlagProps> = ({
  countryCode,
  className = "",
  width = 24,
  height = 16,
  alt = "Country Flag",
}) => {
  const flagImage = countryFlagMap[countryCode?.toUpperCase()];

  if (!flagImage) return null;

  return (
    <Image
      src={flagImage}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default CountryFlag;