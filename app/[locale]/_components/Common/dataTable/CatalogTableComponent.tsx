"use client";

import { listCounts } from "@/app/[locale]/_interface/SalesProductInterface";
import { useParams } from "next/navigation";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTablePageEvent,
  DataTableSortEvent,
  SortOrder,
} from "primereact/datatable";
import React, { useState } from "react";
import ButtonIcon from "../../Buttons/ButtonIcon";
import { ArchiveIcon, SearchIcon } from "../../Icons/SVGIcons";

export interface Product {
  id: number;
  _id: string;
  productname: string;
  category: string;
  stockAvailability: string;
  dateCreated: string;
  status: string;
  priceRange: string;
  inquiries: string;
  img: string;
}
export interface TableHeaders {
  id: number;
  field?: string;
  visible: boolean;
  header?: string;
  props?: any;
  disabled: boolean;
  selectedProd?: any;
}
interface DataTableFilterProps {
  tableData: any[];
  uniqueKey: string;
  sortField: string;
  searchPlaceHolder?: string;
  searchQuery: string;
  totalRecords: number;
  first: number;
  rows: number;
  sortOrder: SortOrder;
  listCounts: listCounts;
  columnData: Array<TableHeaders>;
  checkedItems: Array<any>;
  setSearchQuery: (id: string) => void;
  setCheckedItem: (val: any) => void;
  setListStatus: (val: string) => void;
  onPageChange: (event: DataTablePageEvent) => void;
  onSort?: (event: DataTableSortEvent) => void;
  viewData?: (id: any) => void;
  editData?: (id: any) => void;
  archiveData?: (id: any) => void;
  draftData?: (id: any) => void;
  connectNow?: (id: any) => void;
  createReminder?: (id: any) => void;
  convertCustomer?: (id: any) => void;
  sendQuotation?: (id: any) => void;
  initiateBulkArchive?: () => void;
  noHeaderRequired?: boolean;
  selectedProd?: any;
  // children: React.ReactNode;
}

interface DataTableSelectChangeEvent {
  originalEvent: any;
  type: string;
  value: Array<any>;
}

const DataTableComponent: React.FC<DataTableFilterProps> = ({
  tableData,
  uniqueKey,
  checkedItems,
  searchPlaceHolder,
  totalRecords,
  rows,
  first,
  searchQuery,
  columnData,
  listCounts,
  onSort,
  onPageChange,
  initiateBulkArchive,
  setSearchQuery,
  setListStatus,
  setCheckedItem,
  noHeaderRequired,
  selectedProd,
  // children,
}) => {
  const [tableHeaderData, setTableHeaderData] =
    useState<Array<TableHeaders>>(columnData);
  const params = useParams();
  const locale = Array.isArray(params?.locale)
    ? params.locale[0]
    : params?.locale || "en";
  const onSelectChange = (e: DataTableSelectChangeEvent) => {
    if (tableData.length === 0) return;
    // let filteredData = e.value.filter((ele:any) => ele?._id)
    if (e?.type !== "all") {
      // let spreadArray = [...checkedItems, ...e.value];
      setCheckedItem(e.value);
      // setCheckedItem(spreadArray);
      return;
    }
    // setCheckedItem(e.value);
    // let spreadArray = [...checkedItems, ...e.value];
    // setCheckedItem(spreadArray);
    // let uniqueValues: Array<any> = [];
    let uniqueValues: Set<any> = new Set([]);
    if (e.value.length === 0) {
      for (let j = 0; j < checkedItems.length; j++) {
        let isAvailable = false;
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i]?._id === checkedItems[j]._id) isAvailable = true;
          // uniqueValues.push(tableData[i]._id);
        }
        if (!isAvailable) {
          uniqueValues.add(checkedItems[j]);
        }
      }
      //  checkedItems.filter((ele) => {
      //     for (let i = 0; i < tableData.length; i++) {
      //       if (tableData[i]?._id === ele._id) continue;
      //       uniqueValues.add(tableData[i]._id);
      //     }
      //   });
      setCheckedItem([...uniqueValues]);
      return;
    }
    //  else {
    if (checkedItems.length === 0) {
      // let selectedIds = e.value.map((ele) => ele?._id);
      setCheckedItem(e.value);
      return;
    }

    for (let i = 0; i < tableData.length; i++) {
      let isAvailable = false;
      for (let j = 0; j < checkedItems.length; j++) {
        if (tableData[i]?._id === checkedItems[j]._id) isAvailable = true;
        // uniqueValues.push(tableData[i]);
      }
      if (!isAvailable) uniqueValues.add(tableData[i]);
    }
    setCheckedItem([...checkedItems, ...uniqueValues]);
  };
  const renderHeader = () => (
    <>
      <div className="p-datatable-header-left">
        {/* <Tabs
          listCounts={listCounts}
          setListStatus={(val: string) => setListStatus(val)}
          tabsName={catalogTabs}
        /> */}
      </div>
      <div className="p-datatable-header-right">
        {initiateBulkArchive && checkedItems.length > 0 && (
          <ButtonIcon
            onClick={() => initiateBulkArchive()}
            className={"b-c-i-outline b-c-i-rounded"}
          >
            <ArchiveIcon />
          </ButtonIcon>
        )}
        <div className="icon-input-comp">
          <SearchIcon />
          <input
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            placeholder={searchPlaceHolder ?? "Search..."}
            type="search"
            className="forms-input"
          />
        </div>
        {/* <MultiSelectInputs
          optionData={columnData}
          className="customize-dropdown"
          appendTo="self"
          setTableHeaderData={(val: TableHeaders[]) => setTableHeaderData(val)}
          tableHeaderData={tableHeaderData}
        /> */}
      </div>
    </>
  );

  return (
    <>
      <style>
        {`
          .hidden-thead {
            display: none !important;
          }
        `}
      </style>
      <div className="table-comp">
        <DataTable
          value={tableData}
          selection={checkedItems}
          onSelectionChange={(e: any) => onSelectChange(e)}
          // onSelectAllChange={(e) =>
          //   setCheckedItem([...checkedItems, ...tableData])
          // }
          dataKey={uniqueKey}
          selectionMode="checkbox"
          className="multi-check-sort-table"
          pt={{
            thead: {
              className: `${noHeaderRequired ? "hidden-thead" : "thead"}`,
            },
          }}
          header={renderHeader()}
          lazy
          totalRecords={totalRecords}
          paginator={totalRecords > 0 ? true : false}
          first={first}
          rows={rows}
          onSort={onSort}
          onPage={(e: DataTablePageEvent) => onPageChange(e)}
        // sortField={sortField}
        // sortOrder={sortOrder}
        >
          {locale &&
            tableHeaderData.map((ele) => {
              if (ele.visible) {
                return (
                  <Column
                    key={ele.id}
                    field={ele?.field ?? ""}
                    header={ele?.header ? ele.header : ""}
                    {...(ele.props ?? {})}
                    selectedProd={selectedProd}
                  />
                );
              } else return null;
            })}
        </DataTable>
      </div>
    </>
  );
};

export default DataTableComponent;
