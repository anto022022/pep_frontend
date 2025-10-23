import React from "react";

type RegularCheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name?: string;
  label?: string;
  className?: string;
};

export const RegularCheckBox = ({
  name,
  label,
  className,
  ...props
}: RegularCheckBoxProps) => {
  return (
    <label className={`forms-checkbox ${className}`}>
      <div>
        <input type="checkbox" {...props} />
        <span className="custom-checkbox"></span>
      </div>
      {label && <span className="f-r-label">{label}</span>}
    </label>
  );
};
