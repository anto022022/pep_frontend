import Image, { StaticImageData } from "next/image";
import React, { ReactNode } from "react";
import Plus from "../../../../../public/img/icons/plus.svg";
import Typography from "../../Base/Typography";
import ButtonIconLeft from "../../Buttons/ButtonIconLeft";

type NoDataScreenProps = {
  title: string;
  subTitle: string;
  buttonTitle: string;
  image: StaticImageData | string;
  children?: ReactNode;
  onClickAdd?: () => void;
  onClickImport?: () => void;
  disableButton?: boolean;
  className?: string;
  extraTitle?: string;
};

const NoDataScreen: React.FC<NoDataScreenProps> = ({
  title,
  subTitle,
  buttonTitle,
  image,
  children,
  onClickAdd,
  disableButton,
  className = "",
  extraTitle
}) => {
  return (
    <div className={`empty-product-comp ${className}`}>
      <div className="e-p-c-left">
        <div className="e-p-c-content">
          <Typography variant="h2" className="e-p-c-c-title">
            {title}<br />
            {(extraTitle !== '' && extraTitle) ? extraTitle : ''}
          </Typography>
          <Typography
            variant="h3"
            className="e-p-c-c-subtxt"
            style={{ fontSize: "Neue Haas Grotesk Display Pro" }}
          >
            {subTitle}
          </Typography>

          {/* <StepCard
            icon={stage.isProfileComplete ? tick : incomplete}
            title="Complete your profile"
            description="Fill in your business and personal details to set up your account."
            linkText={""}
          />
          <StepCard
            icon={stage.isKYCCompleted || stage.isKYBCompleted ? tick : incomplete}
            title="Verify Your Business (KYC/KYB)"
            description="Upload your verification documents like GST, PAN, or Business Registration to build trust and authenticity."
            linkText={""}
            cardClick={() => {
              if(stage.isKYBCompleted != true || stage.isKYCCompleted != true){
                router.push('/app/settings/account-settings')
              }
            }}
          />
          <StepCard
            icon={stage.isProductAdded ? tick :incomplete}
            title="Add Your First Product"
            description="Publish at least one product to activate your website and start showcasing your offerings."
            linkText="Add Products"
            cardClick={() => {
              
              }}
              onLinkClick={()=>{
                router.push('/app/sales-product/form')              }}
          /> */}
        </div>
        <div className="content-button-wrapper catalog-gap-override">
          {children}
          <ButtonIconLeft
            name={buttonTitle}
            icon={Plus}
            onClick={onClickAdd}
            disabled={disableButton}
          />
        </div>
      </div>
      <div className="e-p-c-right">
        <div className="e-p-c-r-img">
          <Image
            src={image}
            sizes="100vw"
            width={560}
            height={430}
            alt="No Product"
          />
        </div>
      </div>
    </div>
  );
};

export default NoDataScreen;
