import React from 'react';
import { BagTickIcon, CategoryIcon, PieGraphIcon, ProfileTickIcon } from '../Icons/SVGIcons';

interface FeatureGridProps {
  textOne?: string;
  subTextOne?: string;
  textTwo?: string;
  subTextTwo?: string;
  textThree?: string;
  subTextThree?: string;
  textFour?: string;
  subTextFour?: string;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  textOne,
  subTextOne,
  textTwo,
  subTextTwo,
  textThree,
  subTextThree,
  textFour,
  subTextFour,
}) => {
  return (
    <div className="feature-grid-comp">
      <div className="f-g-c-item">
        <BagTickIcon />
        <div className="f-g-c-i-txt-group">
          <span className="f-g-c-i-txt">{textOne}</span>
          <span className="f-g-c-i-subtxt">{subTextOne}</span>
        </div>
      </div>
      <div className="f-g-c-item">
        <ProfileTickIcon />
        <div className="f-g-c-i-txt-group">
          <span className="f-g-c-i-txt">{textTwo}</span>
          <span className="f-g-c-i-subtxt">{subTextTwo}</span>
        </div>
      </div>
      <div className="f-g-c-item">
        <PieGraphIcon />
        <div className="f-g-c-i-txt-group">
          <span className="f-g-c-i-txt">{textThree}</span>
          <span className="f-g-c-i-subtxt">{subTextThree}</span>
        </div>
      </div>
      <div className="f-g-c-item">
        <CategoryIcon />
        <div className="f-g-c-i-txt-group">
          <span className="f-g-c-i-txt">{textFour}</span>
          <span className="f-g-c-i-subtxt">{subTextFour}</span>
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
