import React from "react";
import { DateShowIcon, LocationShowIcon } from "../Icons/SVGIcons";
import Typography from "../Base/Typography";
import Image from "next/image";

interface TradeShowsCardProps {
  date: string;
  showName: string;
  image: string;
  location: string;
  // badgeData: string[]
}

const TradeShowsCard: React.FC<TradeShowsCardProps> = ({
  date,
  showName,
  image,
  location,
  // badgeData,
}) => {
  return (
    <div className="trade-shows-card-comp">
      <div className="t-s-c-c-top">
        <div className="t-s-c-c-t-left">
          <div className="date-show-name">
            <div className="expected-delivery-wrapper">
              <DateShowIcon />
              <Typography className="e-d-w-txt" variant="h5">
                {date}
              </Typography>
            </div>
            <Typography className="d-s-n-name" variant="h3">
              {showName}
            </Typography>
          </div>
          <div className="attend-group">
            <Typography className="min-order-txt" variant="span">
              Why Attend:
            </Typography>
            <Typography className="min-order-txt" variant="span">
              Meet 500+ suppliers, explore innovations.
            </Typography>
          </div>
        </div>
        <div className="t-s-c-c-t-right t-s-c-c-t-img">
          <Image
            src={image}
            alt={showName}
            width={145}
            height={140}
            sizes="100vw"
          />
        </div>
      </div>
      <div className="t-s-c-c-bottom">
        <div className="expected-delivery-wrapper">
          <LocationShowIcon />
          <Typography className="e-d-w-txt" variant="h6">
            {location}
          </Typography>
        </div>
        {/* {badgeData.length > 0 && (
          <div className='badge-group'>
            {badgeData.map((item, index) => (
              <span className='badge-comp b-c-xs b-c-font badge-lght-blue' key={index}>
                {item}
              </span>
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TradeShowsCard;
