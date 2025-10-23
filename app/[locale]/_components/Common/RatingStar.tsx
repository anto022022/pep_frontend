import React from 'react';
import { Rating } from 'primereact/rating';

interface RatingStarProps {
  value?: number | undefined;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  cancel?: boolean;
  stars?: number;
  className?: string;
  id?: string;
}

const RatingStar: React.FC<RatingStarProps> = ({
  value=0,
  onChange = () => {},
  readOnly = false,
  cancel = false,
  stars = 5,
  className = '',
  id,
}) => {
  return (
    <Rating
      value={value}
      onChange={(e) => onChange(e.value || 0)}
      readOnly={readOnly}
      cancel={cancel}
      stars={stars}
      className={`rating-star-comp ${className}`}
      id={id}
    />
  );
};

export default RatingStar
