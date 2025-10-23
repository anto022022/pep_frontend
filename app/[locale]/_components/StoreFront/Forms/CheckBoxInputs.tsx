import React, { FC, InputHTMLAttributes } from "react";

interface CheckBoxInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const CheckBoxInput: FC<CheckBoxInputProps> = ({
  label,
  className = "",
  ...rest
}) => {
  return (
    <label className={`forms-checkbox ${className}`}>
      <div>
        <input type="checkbox" {...rest} />
        <span className="custom-checkbox"></span>
      </div>
      {label && <span className="f-r-label">{label}</span>}
    </label>
  );
};

export default CheckBoxInput;
