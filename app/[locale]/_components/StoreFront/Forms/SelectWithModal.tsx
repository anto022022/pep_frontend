"use client";
import { Dropdown } from "primereact/dropdown";
import React from "react";

export interface SelectWithModalProps {
  options: any[];
  placeholder?: string;
  virtualScrollerOptions?: object;
  filter?: boolean;
  itemTemplate?: (option: any) => React.ReactNode;
  onChange: (value: any) => void;
  selectedValue: any;
  className?: string;
  panelClassName?: string;
}

const SelectWithModal: React.FC<SelectWithModalProps> = ({
  options,
  placeholder,
  virtualScrollerOptions,
  filter,
  itemTemplate,
  onChange,
  selectedValue,
  className = "",
  panelClassName = "",
}) => {
  return (
    <Dropdown
      value={selectedValue}
      onChange={(e) => onChange(e.value)}
      itemTemplate={itemTemplate}
      options={options}
      optionLabel={"name"}
      placeholder={placeholder}
      className={`forms-select-2 ${className}`}
      panelClassName={`dropdown-open ${panelClassName}`}
      appendTo={"self"}
      filter={filter}
      virtualScrollerOptions={virtualScrollerOptions}
    />
  );
};

export default SelectWithModal;
