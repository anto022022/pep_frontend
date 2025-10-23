"use client";
import { AutoComplete } from "primereact/autocomplete";
import React, { FC, useEffect, useRef, useState } from "react";
import { SearchIcon } from "../../Icons/SVGIcons";

interface SearchProps {
  value: any; // selected value (object or null)
  items: any[];
  field: string;
  search: (event: { query: string }) => void;
  onChange: (value: any) => void; // notify parent when item is selected
  customOptionTemplate: (item: any) => React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

const SearchDropdown: FC<SearchProps> = ({
  value,
  items,
  disabled,
  field,
  onChange,
  search,
  customOptionTemplate,
  placeholder = "Search",
}) => {
  const autoCompleteRef = useRef<any>(null);
  const isTriggeredRef = useRef(false);
  const [searchText, setSearchText] = useState(""); // ✅ preserve typed input
  const [selectedValue, setSelectedValue] = useState<any>(null);

  // Sync typed text when a value is selected
  useEffect(() => {
    if (value) {
      setSearchText(value[field] || "");
    } else {
      setSearchText(""); // ✅ clear input if parent cleared value
    }
  }, [value, field]);

  // Auto open suggestions when API returns items
  useEffect(() => {
    if (isTriggeredRef.current && items.length > 0) {
      setTimeout(() => {
        autoCompleteRef.current?.show();
        isTriggeredRef.current = false;
      }, 50);
    }
  }, [items]);

  const handleTrigger = () => {
    isTriggeredRef.current = true;
    search({ query: "" });
  };

  return (
    <div className="autocomplete-dropdown-comp">
      <div className="a-d-c-input-wrap">
        <AutoComplete
          emptyMessage="No products"
          ref={autoCompleteRef}
          value={searchText} // ✅ typed text, not selected object
          suggestions={items}
          completeMethod={search}
          onFocus={handleTrigger}
          onDropdownClick={handleTrigger}
          onTouchStart={handleTrigger}
          onChange={(e) => setSearchText(e.value)} // ✅ update typed text
          onSelect={(e) => {
            setSelectedValue(e.value);
            onChange(e.value);
            setSearchText(e.value?.[field] ?? "");

            autoCompleteRef.current?.hide();
          }}
          className="forms-input-autocomplete"
          placeholder={placeholder}
          appendTo={"self"}
          panelClassName="f-i-a-dropdown"
          itemTemplate={customOptionTemplate}
          field={field}
          disabled={disabled}
          type="search"
          onShow={handleTrigger}
        />
        <SearchIcon className="a-d-c-icon" />
      </div>
    </div>
  );
};

export default SearchDropdown;
