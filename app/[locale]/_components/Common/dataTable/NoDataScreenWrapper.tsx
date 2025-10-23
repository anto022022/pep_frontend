import Image, { StaticImageData } from "next/image";
import React, { ReactNode } from "react";
import Typography from "../../Base/Typography";
type NoDataScreenWrapperProps = {
  title: string;
  extraTitle?: string;
  subTitle: string;
  image: StaticImageData | string;
  alt?: string;
  children?: ReactNode;
  className?: string;
};

const NoDataScreenWrapper: React.FC<NoDataScreenWrapperProps> = ({
  title,
  extraTitle,
  subTitle,
  image,
  alt,
  children,
  className = "",
}) => {
  return (
    <div className={`empty-product-comp ${className}`}>
      <div className="e-p-c-left">
        <div className="e-p-c-content">
          <Typography variant="h2" className="e-p-c-c-title">
            {title}<br />
            {(extraTitle !== '' && extraTitle) ? extraTitle : ''}
          </Typography>
          <Typography variant="h3" className="e-p-c-c-subtxt">
            {subTitle}
          </Typography>
        </div>
        {children}
      </div>
      <div className="e-p-c-right">
        <div className="e-p-c-r-img">
          <Image
            src={image}
            sizes="100vw"
            width={560}
            height={430}
            alt={alt || "add new"}
          />
        </div>
      </div>
    </div>
  );
};

export default NoDataScreenWrapper;
