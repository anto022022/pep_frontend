import Image from "next/image";
import React from "react";
import Typography from "../Base/Typography";
import { ContactType } from "../../_interface/AuthInterface";

type TryAnotherWayOptionsProps = {
  htmlFor: string;
  icon: string;
  name: string;
  subTitle: string;
  id: string;
  defaultChecked?: boolean;
  isDisabled: boolean;
  alt: string;
  type: ContactType;
  sendOtp: (val: ContactType) => void;
};

const TryAnotherWayOptions: React.FC<TryAnotherWayOptionsProps> = ({
  htmlFor,
  icon,
  name,
  subTitle,
  id,
  defaultChecked = false,
  alt,
  isDisabled,
  sendOtp,
  type,
}) => {
  return (
    <label htmlFor={htmlFor} className="radio-card-comp">
      <div className="icon-txt-wrap">
        <Image src={icon} width={30} height={30} alt={alt} />
        <div className="txt-wrapper">
          <Typography variant="span" className="t-w-title">
            {name}
          </Typography>
          <Typography variant="span" className="t-w-subtxt">
            {subTitle}
          </Typography>
        </div>
      </div>
      <input
        type="radio"
        id={id}
        className="forms-radio"
        name="anotherWayOption"
        disabled={isDisabled}
        defaultChecked={defaultChecked}
        onClick={() => sendOtp(type)}
      />
    </label>
  );
};

export default TryAnotherWayOptions;
