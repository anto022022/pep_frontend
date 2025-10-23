import Image from 'next/image';
import React from 'react';
import Typography from '../Base/Typography';
import { PepIcon } from '../Icons/SVGIcons';

interface InsightsCardProps {
  image: string;
  name: string;
  date: string;
  badgeTheme?: string;
  categoryName: string;
  companyName: string;
  readTime: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({
  image,
  name,
  date,
  badgeTheme,
  categoryName,
  companyName,
  readTime,
}) => {
  return (
    <div className="insights-card-comp">
      <div className="i-c-c-top">
        <div className="i-c-c-t-img">
          <Image src={image} alt={name} sizes="50vw" width={350} height={175} />
        </div>
        <div className="i-c-c-t-info">
          <div className="i-c-c-t-i-date-badge">
            <Typography className="min-order-txt" variant="h4">
              {date}
            </Typography>
            <span
              className={`badge-comp b-c-xs b-c-font ${badgeTheme || 'badge-lght-green'}`}
            >
              {categoryName}
            </span>
          </div>
          <Typography className="insights-title" variant="h3">
            {name}
          </Typography>
        </div>
      </div>
      <div className="i-c-c-bottom">
        <PepIcon />
        <Typography className="min-order-txt dark-grey" variant="h4">
          {companyName}
        </Typography>
        <Typography className="min-order-txt dark-grey" variant="h4">
          •
        </Typography>
        <Typography className="min-order-txt dark-grey" variant="h4">
          Reading: {readTime}
        </Typography>
      </div>
    </div>
  );
};

export default InsightsCard;