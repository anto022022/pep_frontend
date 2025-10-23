import React from "react";
import Image from "next/image";
import Typography from "../Base/Typography";

interface ButtonIconLeftProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  icon: any;
  width?: number;
  height?: number;
}

const ButtonIconLeft: React.FC<ButtonIconLeftProps> = ({
  name,
  icon,
  className = "",
  width,
  height,
  ...props
}) => {
  return (
    <button
      className={`btn-comp btn-left btn-c-primary btn-c-lg ${className}`}
      {...props}
    >
      <Image src={icon} width={width} height={height} alt={name} />
      <Typography variant="span" className="b-c-txt">
        {name}
      </Typography>
    </button>
  );
};

export default ButtonIconLeft;
