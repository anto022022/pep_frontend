"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import { ProductImage } from "@/app/[locale]/_interface/MarketPlaceInterface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface ProfileGroupProps {
  imagesData?: ProductImage[];
  totalResponses: number;
}

const ProfileGroup: React.FC<ProfileGroupProps> = ({
  imagesData,
  totalResponses,
}) => {
  const t = useTranslations("common.mobTable");
  return (
    <div className="profile-group-comp">
      <div className="p-g-c-image-group">
        {imagesData &&
          imagesData.length > 0 &&
          imagesData.slice(0, 5).map((item, index) => (
            <div className="p-g-c-i-g-item" key={index}>
              <Image
                src={item.src}
                alt={item.alt}
                sizes="10vw"
                width={32}
                height={32}
              />
            </div>
          ))}
      </div>
      <div className="p-g-c-response-count">
        <Typography variant="span" className="p-g-c-r-c-count">
          {totalResponses}
        </Typography>
        <Typography variant="span" className="p-g-c-r-c-txt">
          {t("totalResponses")}
        </Typography>
      </div>
    </div>
  );
};

export default ProfileGroup;
