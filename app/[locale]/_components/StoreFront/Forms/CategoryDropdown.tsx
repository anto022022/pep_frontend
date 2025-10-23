"use client";
import { AutoComplete } from "primereact/autocomplete";
import React, { useRef } from "react";
import { SearchIcon } from "../../Icons/SVGIcons";

interface CategoryDropdownProps {
  value: any;
  suggestions: any;
  emptyList: any;
  onChange: (value: any) => void;
  name: string;
  searchFunc: (value: any) => void;
  itemTemplate?: (item: any) => React.ReactNode;
  placeholder: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  suggestions,
  emptyList,
  onChange,
  searchFunc,
  itemTemplate,
  placeholder,
}) => {
  const acRef = useRef<AutoComplete>(null);
  return (
    <div className="autocomplete-dropdown-comp">
      <AutoComplete
        ref={acRef}
        value={value}
        suggestions={suggestions}
        completeMethod={(e: any) => searchFunc(e.query)}
        field="value"
        onSelect={(e) => onChange(e.value)}
        onFocus={() => {
          acRef.current?.show();
          searchFunc("");
        }}
        onClick={() => {
          acRef.current?.show();
        }}
        itemTemplate={itemTemplate}
        className="forms-input-autocomplete"
        panelClassName="f-i-a-dropdown"
        appendTo={"self"}
        showEmptyMessage={true}
        emptyMessage={emptyList as unknown as string}
        placeholder={placeholder}
      />
      <SearchIcon className={"a-d-c-icon"} />
    </div>
  );
};

export default CategoryDropdown;
