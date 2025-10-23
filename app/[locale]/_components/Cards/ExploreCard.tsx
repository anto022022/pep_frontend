import React from "react";
import { ProfileTickIcon, RightArrowIcon } from "../Icons/SVGIcons";
import Typography from "../Base/Typography";
import Link from "next/link";

interface ExploreCardProps {
  title: string;
  subTxt: string;
  linkTxt: string;
  path: string;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  title,
  subTxt,
  linkTxt,
  path,
}) => {
  return (
    <div className="explore-card-comp">
      <div className="e-c-c-top">
        <ProfileTickIcon />
        <div className="e-c-c-content-wrapper">
          <Typography variant="span" className="e-c-c-c-w-title">
            {title}
          </Typography>
          <Typography variant="span" className="e-c-c-c-w-subtxt">
            {subTxt}
          </Typography>
        </div>
      </div>
      <div className="e-c-c-bottom">
        <Link href={path} className="e-c-c-link">
          <Typography className="e-c-c-l-txt" variant="span">
            {linkTxt}
          </Typography>
          <RightArrowIcon />
        </Link>
      </div>
    </div>
  );
};

export default ExploreCard;
