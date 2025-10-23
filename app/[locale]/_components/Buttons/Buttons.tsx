"use client";
import { ButtonHTMLAttributes, FC } from "react";

type ButtonsProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  className: string;
  subClassName?: string;
};

const Buttons: FC<ButtonsProps> = ({
  text,
  className = "",
  subClassName = "b-c-txt",
  ...rest
}) => {
  return (
    <button className={`btn-comp ${className}`} {...rest}>
      <span className={subClassName}>{text}</span>
    </button>
  );
};

export default Buttons;
