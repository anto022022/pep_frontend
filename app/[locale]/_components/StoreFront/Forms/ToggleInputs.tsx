import React, { FC } from "react";

interface ToggleInputProps {
  name?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
}

const ToggleInput: FC<ToggleInputProps> = ({
  name,
  checked,
  onChange,
  onBlur,
  label = "Toggle",
  className,
}) => {
  return (
    <div className={`forms-toggle ${className}`}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

export default ToggleInput;
