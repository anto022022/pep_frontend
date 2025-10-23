import React, { FC, InputHTMLAttributes } from "react";

interface RadioButtonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const RadioButtonInput: FC<RadioButtonInputProps> = ({
  label,
  className = "",
  ...rest
}) => {
  return (
    <label className={`forms-checkbox ${className}`}>
      <div>
        <input type="radio" {...rest} />
        <span className="custom-radio"></span>
      </div>
      {label && <span className="f-r-label">{label}</span>}
    </label>
  );
};

export default RadioButtonInput;
