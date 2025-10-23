'use client'
import React, { useState } from 'react'
import { Dropdown, DropdownChangeEvent, DropdownProps } from "primereact/dropdown"

type OptionType = {
  [key: string]: any;
};

interface SelectWithItemsProps {
  options: OptionType[];
  placeholder?: string;
  virtualScrollerOptions?: DropdownProps['virtualScrollerOptions'];
  filter?: boolean;
  className?: string;
  panelClassName?: string;
  appendTo?: boolean;
  itemTemplate?: (option: any) => React.ReactNode;
  valueTemplate?: (option: any, props: any) => React.ReactNode;
  optionLabel?: string;
  value?: any;
  onChange?: (e: DropdownChangeEvent) => void;
}

const SelectWithItems: React.FC<SelectWithItemsProps> = ({
  options,
  placeholder,
  virtualScrollerOptions,
  filter = false,
  className = '',
  panelClassName = '',
  appendTo = true,
  itemTemplate,
  valueTemplate,
  optionLabel = 'name',
  value,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(null);

  const handleChange = (e: DropdownChangeEvent) => {
    setSelectedOption(e.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <Dropdown
      value={value ?? selectedOption}
      onChange={handleChange}
      options={options}
      optionLabel={optionLabel}
      placeholder={placeholder}
      className={`forms-select-2 ${className}`}
      panelClassName={`dropdown-open ${panelClassName}`}
      appendTo={appendTo ? 'self' : undefined}
      filter={filter}
      virtualScrollerOptions={virtualScrollerOptions}
      itemTemplate={itemTemplate}
      valueTemplate={valueTemplate}
    />
  );
};

export default SelectWithItems;
