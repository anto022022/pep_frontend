"use client";

import { useTranslations } from "next-intl";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { VirtualScrollerProps } from "primereact/virtualscroller";
import React, { FC, useState } from "react";

interface MultiSelectInputsProps {
  className?: string;
  value?: any[]; // Always an array
  onChange?: (e: MultiSelectChangeEvent) => void;
  onShow?: () => void;
  onFilterChange?: (e: { filter: string }) => void;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  filter?: boolean;
  display?: "comma" | "chip";
  maxSelectedLabels?: number;
  itemTemplate?: (item: any) => React.ReactNode;
  selectedItemTemplate?: (value: any) => React.ReactNode;
  disabled?: boolean;
  virtualScrollerOptions?: VirtualScrollerProps;
  selectAllLabel?: string;
  appendTo?: HTMLElement | "self" | (() => HTMLElement) | null;
}

const MultiSelectInputs: FC<MultiSelectInputsProps> = ({
  appendTo = "self",
  className = "",
  value,
  onChange,
  onShow,
  onFilterChange,
  options,
  optionLabel = "name",
  optionValue,
  placeholder,
  filter = false,
  itemTemplate,
  selectedItemTemplate,
  maxSelectedLabels = 3,
  disabled = false,
  virtualScrollerOptions,
  selectAllLabel,
}) => {
  const [internalValue, setInternalValue] = useState<any[]>([]);
  const common = useTranslations("common");
  const handleChange = (e: MultiSelectChangeEvent) => {
    setInternalValue(e.value);
    onChange?.(e);
  };

  return (
    <MultiSelect
      value={value ?? internalValue ?? []}
      onChange={handleChange}
      options={options}
      onShow={onShow}
      onFilter={onFilterChange}
      optionLabel={optionLabel}
      optionValue={optionValue}
      placeholder={placeholder ? placeholder : common("Select")}
      maxSelectedLabels={maxSelectedLabels}
      filter={filter}
      className={`forms-select-2 ${className}`} 
      panelClassName="custom-dropdown"
      itemTemplate={itemTemplate}
      selectedItemTemplate={selectedItemTemplate}
      disabled={disabled}
      appendTo={appendTo}
      virtualScrollerOptions={virtualScrollerOptions}
      selectAllLabel={selectAllLabel ? selectAllLabel : common("selectAll")}
      // unselectAllLabel is not supported by PrimeReact MultiSelect
    />
  );
};

export default MultiSelectInputs;
