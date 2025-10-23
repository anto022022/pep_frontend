import React from "react";

type ButtonIconProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const ButtonIcon: React.FC<ButtonIconProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <button type="button" className={`btn-comp b-c-icon ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default ButtonIcon;
