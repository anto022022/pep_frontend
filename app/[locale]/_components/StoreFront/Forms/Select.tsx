"use client";
import { Dropdown } from "primereact/dropdown";
import { VirtualScrollerProps } from "primereact/virtualscroller";
import React, { FC, useRef } from "react";
import { useTranslations } from "next-intl";
interface SelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: any[];
  optionValue?: string;
  placeholder?: string;
  optionLabel?: string;
  value: any;
  itemSize?: number;
  onChange: (value: any) => void;
  filter?: boolean;
  filterBy?: string;
  itemTemplate?: (item: any) => React.ReactNode;
  emptyMessage?: React.ReactNode;
  valueTemplate?: (item: any) => React.ReactNode;
  onFilterChange?: (searchString: string) => void;
  virtualScrollerOptions?: VirtualScrollerProps;
  panelClassName?: string;
  loading?: boolean;
  appendTo?: "self" | null | HTMLElement | (() => HTMLElement);
}

const Select: FC<SelectProps> = ({
  optionLabel = "name",
  options,
  optionValue,
  placeholder,
  value,
  onChange,
  filter = false,
  filterBy = "",
  itemSize,
  itemTemplate,
  valueTemplate,
  onFilterChange,
  panelClassName,
  virtualScrollerOptions,
  appendTo = "self",
  loading = false,
  emptyMessage,
  ...props
}) => {
  const common = useTranslations("common");
  const dropdownRef = useRef<any>(null);
  return (
    <Dropdown
      {...props}
      ref={dropdownRef}
      value={value}
      options={options}
      optionValue={optionValue}
      optionLabel={optionLabel}
      placeholder={placeholder ? placeholder : common("Select")}
      className={`${props.className} forms-select-2`}
      panelClassName={`dropdown-open ${panelClassName}`}
      onChange={(e) => onChange(e.value)}
      appendTo={appendTo}
      filter={filter}
      filterBy={filterBy}
      itemTemplate={itemTemplate}
      onFilter={(e) => onFilterChange?.(e.filter)}
      valueTemplate={valueTemplate}
      virtualScrollerOptions={virtualScrollerOptions}
      filterInputAutoFocus
      loading={loading}
      emptyMessage={emptyMessage ? emptyMessage : "No results found"}
    />
  );
};

export default Select;
