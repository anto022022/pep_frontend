import React, { useState } from "react";
import Typography from "@/app/[locale]/_components/Base/Typography";
import { useTranslations } from "next-intl";
import style from "@/assets/styles-modules/product-details.module.css";

type ProductDescriptionProps = {
  description: string;
};

const MAX_LENGTH = 180;

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  const t = useTranslations("productDetailPage");
  const [expanded, setExpanded] = useState(false);

  // Decide what text to show
  const isLong = description.length > MAX_LENGTH;
  const displayText =
    expanded || !isLong
      ? description
      : description.slice(0, MAX_LENGTH) + "...";

  return (
    <div id="description" className="detail-box-wrapper description-box">
      <Typography variant="h4" className="d-b-w-title">
        {t("description")}
      </Typography>

      <Typography variant="pre" className="d-b-txt">
        {displayText}
      </Typography>

      {/* Show more / less button */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`btn-plain-txt ${style.productDescriptionShowMore}`}
        >
          {expanded ? t("showLess") : t("showMore")}
        </button>
      )}
    </div>
  );
};

export default ProductDescription;
