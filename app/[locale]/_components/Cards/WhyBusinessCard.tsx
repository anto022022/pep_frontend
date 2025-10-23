import Image from "next/image";
import React from "react";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";
import { ParcelBoxIcon, StatusUpIcon, TemplateIcon } from "../Icons/SVGIcons";

interface WhyBusinessCardProps {
  title: string;
  featureOne: string;
  featureTwo: string;
  featureThree: string;
  image: string;
  buttonName: string;
  onClick: () => void;
}

const WhyBusinessCard: React.FC<WhyBusinessCardProps> = ({
  title,
  featureOne,
  featureTwo,
  featureThree,
  image,
  buttonName,
  onClick,
}) => {
  return (
    <div className="why-bussiness-card-comp">
      <div className="w-b-c-c-left">
        <Typography className="w-b-c-c-l-title">{title}</Typography>
        <div className="w-c-c-feature-list">
          <div className="w-c-c-f-l-item">
            <ParcelBoxIcon />
            <Typography className="w-b-c-c-l-i-txt" variant="span">
              {featureOne}
            </Typography>
          </div>
          <div className="w-c-c-f-l-item">
            <StatusUpIcon />
            <Typography className="w-b-c-c-l-i-txt" variant="span">
              {featureTwo}
            </Typography>
          </div>
          <div className="w-c-c-f-l-item">
            <TemplateIcon />
            <Typography className="w-b-c-c-l-i-txt" variant="span">
              {featureThree}
            </Typography>
          </div>
        </div>
        <Buttons
          onClick={onClick}
          className="btn-c-primary"
          text={buttonName}
        />
      </div>
      <div className="w-b-c-c-right w-b-c-c-img">
        <Image src={image} alt="Image" width={145} height={220} sizes="100vw" />
      </div>
    </div>
  );
};

export default WhyBusinessCard;
