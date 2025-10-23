"use client";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import React, { useEffect, useState } from "react";
import { TableHeaders } from "../../_interface/common";
import { useTranslations } from "next-intl";
interface MultiSelectInputsProps {
  className?: string;
  optionData: any;
  setTableHeaderData: (event: TableHeaders[]) => void;
  tableHeaderData: TableHeaders[];
  [key: string]: any;
}

const MultiSelectInputs: React.FC<MultiSelectInputsProps> = ({
  className = "",
  optionData,
  setTableHeaderData,
  tableHeaderData,
  ...otherProps
}) => {
  const common = useTranslations("common");
  const [selectedMenus, setSelectedMenus] = useState<TableHeaders[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<TableHeaders[]>();

  useEffect(() => {
    filterData();
  }, []);

  const filterData = () => {
    let selectedArray: Array<TableHeaders> = [];
    let filteredData = optionData.filter((ele: TableHeaders) => {
      if (ele.field && ele.visible) {
        selectedArray.push(ele);
      }
      if (ele.field) return ele;
    });
    setFilteredMenus(filteredData);
    setSelectedMenus(selectedArray);
  };

  const editTableHeader = (event: MultiSelectChangeEvent) => {
    let selectedValue = event.selectedOption;
    if (Array.isArray(selectedValue)) {
      let disabledValues: TableHeaders[] = [];
      let updatedHeaderData = tableHeaderData.filter((ele: TableHeaders) => {
        // if (!ele.field) return;
        let value = ele;
        if (!ele.disabled && ele.field) {
          value.visible = selectedValue.length > 0 ? true : false;
        } else if (ele.disabled) {
          disabledValues.push(ele);
        }
        return value;
      });
      setTableHeaderData(updatedHeaderData);
      disabledValues = [...disabledValues, ...event.value];
      setSelectedMenus(disabledValues as any);
    } else {
      let updatedHeaderData = tableHeaderData.filter((ele: TableHeaders) => {
        let value = ele;
        if (!ele.disabled && ele.id === selectedValue.id) {
          value.visible = !value.visible;
        }
        return value;
      });
      setTableHeaderData(updatedHeaderData);
      setSelectedMenus(event.value);
    }
  };

  return (
    <>
      <MultiSelect
        value={selectedMenus}
        onChange={(e) => editTableHeader(e)}
        options={filteredMenus}
        optionLabel={`header`}
        placeholder={`${common("Customize")}`}
        selectedItemsLabel={`{0} ${common("ItemSelected")}`}
        selectAllLabel={`${common("mobTable.selectAll")}`}
        maxSelectedLabels={1}
        className={`forms-select-2 ${className}`}
        panelClassName="custom-dropdown"
        {...otherProps}
      />
    </>
  );
};

export default MultiSelectInputs;
