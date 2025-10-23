// MobileProductCard.tsx
import { DataTableOptions } from "@/app/[locale]/_components/Common/dataTable/DataTableOptions";
import { RowStatus } from "@/app/[locale]/_components/Common/dataTable/RowStatus";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { TableEnumPipe } from "@/app/[locale]/_components/Pipe/TableEnumPipe";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { StockAvailabilityEnum } from "@/app/[locale]/_interface/SalesProductInterface";
import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import Image from "next/image";
import React from "react";

interface MobileProductCardProps {
  item: any;
  selectedProducts: any[];
  handleCheckboxChange: (checked: boolean, item: any) => void;
  handleTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd?: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchCancel?: (e: React.TouchEvent<HTMLDivElement>) => void;
  viewProduct?: (item: any) => void;
  editProduct?: (item: any) => void;
  archiveProduct?: (item: any) => void;
  handleCreateVariant?: (item: any) => void;
  queryParams: any;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
  item,
  selectedProducts,
  handleCheckboxChange,
  handleTouchStart,
  handleTouchEnd,
  handleTouchCancel,
  viewProduct,
  editProduct,
  archiveProduct,
  handleCreateVariant,
  queryParams,
}) => {
  return (
    <div
      className="table-card-comp"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <div className="t-c-c-left">
        <CheckBoxInputs
          id={item?._id}
          className="sm light-bg"
          checked={selectedProducts.some((i) => i._id === item._id)}
          onchange={(e) => handleCheckboxChange(e.target.checked, item)}
        />

        <div className="t-c-c-l-wrapper">
          {item.productImageSrc && (
            <div className="t-c-c-img">
              <Image
                src={getImageUrl(item.productImageSrc)}
                alt={item.productName}
                width={48}
                height={48}
                sizes="100vw"
              />
            </div>
          )}
          <span
            className={`t-c-c-txt stock-txt
              ${item.stockAvailability === "inStock" ? "instock" : ""}
              ${item.stockAvailability === "outOfStock" ? "out-of-stock" : ""}
            `}
          >
            <TableEnumPipe
              value={item.stockAvailability ?? ""}
              enumType={StockAvailabilityEnum}
            />
          </span>
        </div>

        <div className="t-c-c-info">
          <RowStatus key={item._id} rowData={item} status={item.status} />
          <span className="t-c-c-txt txt-bold">{item.productName}</span>
          <span className="t-c-c-txt">
            <PricePipe
              pricing={item?.pricing ?? {}}
              key={item._id}
              currency={
                item?.currency
                  ? typeof item?.currency === "string"
                    ? item?.currency
                    : item?.currency?.symbol
                  : "₹"
              }
            />
          </span>
        </div>
      </div>

      <div className="t-c-c-right">
        <DataTableOptions
          key={item._id}
          rowData={item}
          viewProduct={viewProduct}
          editProduct={editProduct}
          archiveProduct={
            queryParams.itemStatus === "archive" ? undefined : archiveProduct
          }
          createVariant={
            item.productStage[ProductStageKey.Specification] !== "pending"
              ? handleCreateVariant
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default MobileProductCard;
