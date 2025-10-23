import React from "react";

interface ButtonsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
}

const CustomButton: React.FC<ButtonsProps> = ({
  className = "",
  text,
  type="button",
  ...props
}) => {
  return (
    <button type={type?type:"button"} className={`btn-comp ${className}`} {...props}>
      <span className="b-c-txt">{text}</span>
    </button>
  );
};

export default CustomButton;
