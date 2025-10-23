import Image, { StaticImageData } from "next/image";
import React from "react";

type StepCardProps = {
  icon: StaticImageData | string;
  title: string;
  description: string;
  linkText?: string;
  onLinkClick?: () => void;
  cardClick?: () => void;
  clickable?: boolean; // new prop
};

const StepCard: React.FC<StepCardProps> = ({
  icon,
  title,
  description,
  linkText,
  onLinkClick,
  cardClick,
  clickable = true,
}) => {
  return (
    <div
      className="step-card"
      style={{ cursor: clickable ? "pointer" : "default" }}
      onClick={clickable ? cardClick : undefined}
    >
      <div className="step-card-icon">
        <Image src={icon} alt="status icon" width={20} height={20} />
      </div>
      <div className="step-card-content">
        <strong className="step-card-title">{title}</strong>
        <p className="step-card-description">{description}</p>
        {linkText && (
          <button
            className="step-card-link"
            onClick={(e) => {
              e.stopPropagation();
              onLinkClick?.();
            }}
          >
            {linkText} →
          </button>
        )}
      </div>
    </div>
  );
};

export default StepCard;
