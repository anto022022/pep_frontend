import Image from "next/image";
import React, { FC } from "react";
import Typography from "../Base/Typography";

export interface buttonIconRightInterface {
  type?: "button" | "submit" | "reset" | undefined;
  icon?: string;
  name: string;
  theme?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ButtonIconRight: FC<buttonIconRightInterface> = ({
  name,
  type = "button",
  icon,
  theme,
  className,
  onClick,
  disabled = false,
  children,
}) => {
  return (
    <button
      className={`btn-comp btn-right btn-c-primary btn-c-lg ${
        theme || "btn-c-primary"
      } ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      <Typography variant="span" className="b-c-txt">
        {name}
      </Typography>
      {children ||
        (icon && <Image src={icon} width={28} height={28} alt={name}></Image>)}
    </button>
  );
};

export default ButtonIconRight;
