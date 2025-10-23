import React from "react";

interface CheckBoxInputsInterface {
  label?: string | React.ReactNode;
  className: string;
  id: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBoxInputs: React.FC<CheckBoxInputsInterface> = (props) => {
  const { label, onchange, className, checked, defaultChecked, id } = props;
  return (
    <label className={`forms-checkbox ${className}`}>
      <input
        type="checkbox"
        onChange={onchange}
        id={id}
        defaultChecked={defaultChecked}
        checked={checked}
      />
      <span className="custom-checkbox"></span>
      {label && <span className="f-r-label">{label}</span>}
    </label>
  );
};

export default CheckBoxInputs;
