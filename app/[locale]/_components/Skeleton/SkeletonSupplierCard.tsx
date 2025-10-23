import { Skeleton } from "primereact/skeleton";
import React from "react";
import { PlaceholderImageIcon } from "../Icons/SVGIcons";

const SkeletonSupplierCard = () => {
  return (
    <div className="skel-supplier-card supplier-card-comp floating-bottom-hover">
      <div className="company-info">
        <div className="c-i-img">
          <Skeleton width="48px" height="48px"></Skeleton>
        </div>
        <div className="c-i-details">
          <Skeleton width="70%" height="20px"></Skeleton>
          <div className="company-meta-badge">
            <div className="c-m-b-item">
              <Skeleton width="78px" height="15px"></Skeleton>
            </div>
            <div className="c-m-b-item">
              <Skeleton width="45px" height="18px"></Skeleton>
            </div>
            <div className="c-m-b-item">
              <Skeleton width="30px" height="16px"></Skeleton>
            </div>
          </div>
        </div>
      </div>
      <div className="product-image-card-group-comp">
        <div className="p-i-c-g-c-item">
          <div className="pos-rel">
            <Skeleton width="140px" height="135px"></Skeleton>
            <div className="placeholder-icon">
              <PlaceholderImageIcon />
            </div>
          </div>
          <Skeleton width="70%" height="15px"></Skeleton>
        </div>
        <div className="p-i-c-g-c-item">
          <div className="pos-rel">
            <Skeleton width="140px" height="135px"></Skeleton>
            <div className="placeholder-icon">
              <PlaceholderImageIcon />
            </div>
          </div>
          <Skeleton width="70%" height="15px"></Skeleton>
        </div>
        <div className="p-i-c-g-c-item">
          <div className="pos-rel">
            <Skeleton width="140px" height="135px"></Skeleton>
            <div className="placeholder-icon">
              <PlaceholderImageIcon />
            </div>
          </div>
          <Skeleton width="70%" height="15px"></Skeleton>
        </div>
      </div>
    </div>
  );
};

export default SkeletonSupplierCard;
